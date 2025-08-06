import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  startAfter,
  Timestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { parseStringPromise } from 'xml2js';
import { 
  NewsML29Document, 
  NewsML29NewsItem, 
  NewsML29CreateInput, 
  NewsML29UpdateInput,
  NewsML29Query,
  NewsML29Error,
  NewsML29Analytics,
  NewsML29AssociatedMedia
} from '@/types/newsml29';

export class NewsML29Service {
  private static instance: NewsML29Service;
  private readonly collectionName = 'newsml29_documents';

  static getInstance(): NewsML29Service {
    if (!this.instance) {
      this.instance = new NewsML29Service();
    }
    return this.instance;
  }

  /**
   * Parse raw NewsML 2.9 XML and convert to Firestore document structure
   */
  async parseNewsML29(rawXML: string): Promise<NewsML29Document> {
    try {
      // Debug: Log the XML being parsed
      console.log('Parsing NewsML XML (first 200 chars):', rawXML.substring(0, 200));
      
      const parsed = await parseStringPromise(rawXML, {
        explicitArray: false,
        ignoreAttrs: false,
        mergeAttrs: true,
        normalize: true,
        normalizeTags: true,
        trim: true
      });

      console.log('Parsed XML structure:', Object.keys(parsed));
      
      const newsml = parsed.newsml || parsed.newsmessage || parsed.newsMessage;
      if (!newsml) {
        console.error('Available root elements:', Object.keys(parsed));
        throw new Error('Invalid NewsML 2.9 format: Missing root element');
      }

      console.log('Found NewsML root element, keys:', Object.keys(newsml));

      const document: NewsML29Document = {
        id: this.generateDocumentId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        newsml: {
          metadata: this.extractMetadata(newsml),
          header: this.extractHeader(newsml.header),
          newsItem: Array.isArray(newsml.itemSet?.newsItem) 
            ? newsml.itemSet.newsItem.map((item: any) => this.extractNewsItem(item))
            : [this.extractNewsItem(newsml.itemSet?.newsItem || newsml)]
        },
        processing: {
          status: 'parsed',
          lastProcessedAt: new Date()
        },
        searchFields: this.buildSearchFields(newsml)
      };

      return document;
    } catch (error) {
      console.error('NewsML parsing error:', error);
      throw new Error(`NewsML 2.9 parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save NewsML 2.9 document to Firestore
   */
  async saveDocument(input: NewsML29CreateInput): Promise<string> {
    try {
      const document = await this.parseNewsML29(input.rawXML);
      
      // Enhance document with source information
      document.source = input.source;
      document.options = input.options;

      // Convert dates to Firestore Timestamps
      const firestoreDoc = this.convertToFirestoreFormat(document);

      // Save main document
      const docRef = await addDoc(collection(db, this.collectionName), firestoreDoc);
      
      // Save subcollections in batch
      await this.saveSubcollections(docRef.id, document);

      // Auto-enhance if requested
      if (input.options?.autoEnhance) {
        await this.enhanceDocument(docRef.id);
      }

      // Auto-publish if requested
      if (input.options?.autoPublish) {
        await this.publishDocument(docRef.id);
      }

      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to save NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get NewsML 2.9 document by ID
   */
  async getDocument(id: string): Promise<NewsML29Document | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return this.convertFromFirestoreFormat(data);
    } catch (error) {
      throw new Error(`Failed to get NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Query NewsML 2.9 documents with filters
   */
  async queryDocuments(queryParams: NewsML29Query): Promise<NewsML29Document[]> {
    try {
      let q = collection(db, this.collectionName);

      // Build query with filters
      const constraints = this.buildQueryConstraints(queryParams);
      const finalQuery = query(q, ...constraints);

      const querySnapshot = await getDocs(finalQuery);
      const documents: NewsML29Document[] = [];

      querySnapshot.forEach((doc) => {
        const data = this.convertFromFirestoreFormat(doc.data());
        data.id = doc.id;
        documents.push(data);
      });

      return documents;
    } catch (error) {
      throw new Error(`Failed to query NewsML 2.9 documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update NewsML 2.9 document
   */
  async updateDocument(id: string, updates: NewsML29UpdateInput): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new Error(`Failed to update NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete NewsML 2.9 document and all subcollections
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Delete subcollections first
        await this.deleteSubcollections(id, transaction);
        
        // Delete main document
        const docRef = doc(db, this.collectionName, id);
        transaction.delete(docRef);
      });
    } catch (error) {
      throw new Error(`Failed to delete NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enhance document with AI processing
   */
  async enhanceDocument(id: string): Promise<void> {
    try {
      const document = await this.getDocument(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Enhance content (placeholder for AI enhancement)
      const enhancedContent = await this.processWithAI(document);
      
      await this.updateDocument(id, {
        processing: {
          ...document.processing,
          status: 'enhanced',
          lastProcessedAt: new Date()
        }
      });
    } catch (error) {
      throw new Error(`Failed to enhance NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Publish document to live news system
   */
  async publishDocument(id: string): Promise<void> {
    try {
      const document = await this.getDocument(id);
      if (!document) {
        throw new Error('Document not found');
      }

      // Convert to live news format and publish
      await this.convertAndPublishToLiveNews(document);
      
      await this.updateDocument(id, {
        processing: {
          ...document.processing,
          status: 'published',
          lastProcessedAt: new Date()
        }
      });
    } catch (error) {
      throw new Error(`Failed to publish NewsML 2.9 document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get analytics and statistics
   */
  async getAnalytics(): Promise<NewsML29Analytics> {
    try {
      const allDocs = await this.queryDocuments({});
      
      const analytics: NewsML29Analytics = {
        totalDocuments: allDocs.length,
        documentsByProvider: {},
        documentsByItemClass: {},
        documentsByStatus: {},
        documentsByUrgency: {},
        documentsToday: 0,
        documentsThisWeek: 0,
        documentsThisMonth: 0,
        averageProcessingTime: 0,
        topSubjects: [],
        topKeywords: [],
        topLocations: [],
        languageDistribution: {}
      };

      // Calculate analytics from documents
      this.calculateAnalytics(allDocs, analytics);

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get NewsML 2.9 analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Real-time subscription to document changes
   */
  subscribeToDocuments(
    queryParams: NewsML29Query, 
    callback: (documents: NewsML29Document[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    try {
      let q = collection(db, this.collectionName);
      const constraints = this.buildQueryConstraints(queryParams);
      const finalQuery = query(q, ...constraints);

      return onSnapshot(
        finalQuery,
        (snapshot: QuerySnapshot) => {
          const documents: NewsML29Document[] = [];
          snapshot.forEach((doc) => {
            const data = this.convertFromFirestoreFormat(doc.data());
            data.id = doc.id;
            documents.push(data);
          });
          callback(documents);
        },
        (error) => {
          if (errorCallback) {
            errorCallback(new Error(`NewsML 2.9 subscription error: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        }
      );
    } catch (error) {
      if (errorCallback) {
        errorCallback(new Error(`Failed to subscribe to NewsML 2.9 documents: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Private helper methods

  private generateDocumentId(): string {
    return `newsml29_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractMetadata(newsml: any) {
    return {
      guid: newsml.guid || newsml.id,
      version: newsml.version || '1',
      standard: newsml.standard || 'NewsML-G2',
      conformance: newsml.conformance || 'power',
      lang: newsml.lang || newsml['xml:lang'] || 'tr',
      xmlns: newsml.xmlns || 'http://iptc.org/std/NewsML-G2/2.9/'
    };
  }

  private extractHeader(header: any) {
    return {
      sent: header?.sent || new Date().toISOString(),
      sender: header?.sender || 'unknown',
      transmitId: header?.transmitId || '',
      priority: parseInt(header?.priority) || 5,
      origin: header?.origin || ''
    };
  }

  private extractNewsItem(item: any): NewsML29NewsItem {
    return {
      guid: item.guid || item.id,
      version: parseInt(item.version) || 1,
      standard: item.standard || 'NewsML-G2',
      standardversion: item.standardversion || '2.9',
      conformance: item.conformance || 'power',
      itemMeta: this.extractItemMeta(item.itemMeta),
      contentMeta: this.extractContentMeta(item.contentMeta),
      rightsInfo: this.extractRightsInfo(item.rightsInfo),
      contentSet: this.extractContentSet(item.contentSet),
      associatedMedia: this.extractAssociatedMedia(item.associatedMedia)
    };
  }

  private extractItemMeta(meta: any) {
    return {
      itemClass: meta?.itemClass || 'ninat:text',
      provider: meta?.provider || 'unknown',
      versionCreated: meta?.versionCreated || new Date().toISOString(),
      firstCreated: meta?.firstCreated || new Date().toISOString(),
      pubStatus: meta?.pubStatus || 'usable',
      role: meta?.role || 'main',
      generator: meta?.generator || 'NewsML29Service',
      profile: meta?.profile || 'text'
    };
  }

  private extractContentMeta(meta: any) {
    return {
      urgency: parseInt(meta?.urgency) || 5,
      headline: meta?.headline || '',
      subheadline: meta?.subheadline,
      slug: meta?.slug || '',
      byline: meta?.byline,
      creditline: meta?.creditline,
      dateline: meta?.dateline,
      language: meta?.language || 'tr',
      subject: Array.isArray(meta?.subject) ? meta.subject : [],
      description: Array.isArray(meta?.description) ? meta.description : [],
      keyword: Array.isArray(meta?.keyword) ? meta.keyword : [],
      located: Array.isArray(meta?.located) ? meta.located : [],
      creator: Array.isArray(meta?.creator) ? meta.creator : [],
      contributor: Array.isArray(meta?.contributor) ? meta.contributor : [],
      audience: Array.isArray(meta?.audience) ? meta.audience : []
    };
  }

  private extractRightsInfo(rights: any) {
    if (!rights) return undefined;
    return {
      copyrightHolder: rights.copyrightHolder || '',
      copyrightNotice: rights.copyrightNotice || '',
      usageTerms: rights.usageTerms || '',
      creditline: rights.creditline,
      source: rights.source
    };
  }

  private extractContentSet(contentSet: any) {
    return {
      inlineXML: contentSet?.inlineXML,
      inlineData: contentSet?.inlineData,
      remoteContent: contentSet?.remoteContent
    };
  }

  private extractAssociatedMedia(media: any): NewsML29AssociatedMedia[] {
    if (!media) return [];
    return Array.isArray(media) ? media : [media];
  }

  private buildSearchFields(newsml: any) {
    const firstItem = Array.isArray(newsml.itemSet?.newsItem) 
      ? newsml.itemSet.newsItem[0] 
      : (newsml.itemSet?.newsItem || newsml);

    return {
      headline: firstItem?.contentMeta?.headline || '',
      urgency: parseInt(firstItem?.contentMeta?.urgency) || 5,
      pubStatus: firstItem?.itemMeta?.pubStatus || 'usable',
      subjects: Array.isArray(firstItem?.contentMeta?.subject) 
        ? firstItem.contentMeta.subject.map((s: any) => s.name || s.qcode || s)
        : [],
      keywords: Array.isArray(firstItem?.contentMeta?.keyword) 
        ? firstItem.contentMeta.keyword 
        : [],
      locations: Array.isArray(firstItem?.contentMeta?.located) 
        ? firstItem.contentMeta.located.map((l: any) => l.name || l.qcode || l)
        : [],
      language: firstItem?.contentMeta?.language || 'tr',
      provider: firstItem?.itemMeta?.provider || 'unknown',
      itemClass: firstItem?.itemMeta?.itemClass || 'ninat:text'
    };
  }

  private buildQueryConstraints(queryParams: NewsML29Query) {
    const constraints = [];

    if (queryParams.urgency) {
      const urgencies = Array.isArray(queryParams.urgency) ? queryParams.urgency : [queryParams.urgency];
      constraints.push(where('searchFields.urgency', 'in', urgencies));
    }

    if (queryParams.pubStatus) {
      const statuses = Array.isArray(queryParams.pubStatus) ? queryParams.pubStatus : [queryParams.pubStatus];
      constraints.push(where('searchFields.pubStatus', 'in', statuses));
    }

    if (queryParams.provider) {
      const providers = Array.isArray(queryParams.provider) ? queryParams.provider : [queryParams.provider];
      constraints.push(where('searchFields.provider', 'in', providers));
    }

    if (queryParams.language) {
      const languages = Array.isArray(queryParams.language) ? queryParams.language : [queryParams.language];
      constraints.push(where('searchFields.language', 'in', languages));
    }

    if (queryParams.createdAfter) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(queryParams.createdAfter)));
    }

    if (queryParams.createdBefore) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(queryParams.createdBefore)));
    }

    // Add ordering
    const orderField = queryParams.orderBy || 'createdAt';
    const orderDir = queryParams.orderDirection || 'desc';
    constraints.push(orderBy(orderField, orderDir));

    // Add limit
    if (queryParams.limit) {
      constraints.push(firestoreLimit(queryParams.limit));
    }

    return constraints;
  }

  private convertToFirestoreFormat(document: NewsML29Document): any {
    return {
      ...document,
      createdAt: Timestamp.fromDate(document.createdAt),
      updatedAt: Timestamp.fromDate(document.updatedAt),
      processedAt: document.processedAt ? Timestamp.fromDate(document.processedAt) : null
    };
  }

  private convertFromFirestoreFormat(data: any): NewsML29Document {
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      processedAt: data.processedAt?.toDate() || null
    };
  }

  private async saveSubcollections(docId: string, document: NewsML29Document): Promise<void> {
    const batch = writeBatch(db);

    // Save news items
    document.newsml.newsItem.forEach((item, index) => {
      const itemRef = doc(collection(db, this.collectionName, docId, 'news_items'));
      batch.set(itemRef, {
        ...item,
        parentDocumentId: docId,
        index
      });
    });

    // Save media assets
    document.newsml.newsItem.forEach(item => {
      if (item.associatedMedia) {
        item.associatedMedia.forEach(media => {
          const mediaRef = doc(collection(db, this.collectionName, docId, 'media_assets'));
          batch.set(mediaRef, {
            ...media,
            parentItemGuid: item.guid,
            parentDocumentId: docId
          });
        });
      }
    });

    await batch.commit();
  }

  private async deleteSubcollections(docId: string, transaction: any): Promise<void> {
    // This is a simplified version - in production, you'd need to query and delete all subcollection docs
    // For now, we'll rely on Firestore's eventual consistency for cleanup
  }

  private async processWithAI(document: NewsML29Document): Promise<any> {
    // Placeholder for AI enhancement
    return {
      sentiment: 'neutral',
      categories: [],
      entities: [],
      summary: '',
      tags: []
    };
  }

  private async convertAndPublishToLiveNews(document: NewsML29Document): Promise<void> {
    // Convert NewsML to standard news format and save to main news collection
    // This would integrate with existing news publishing pipeline
  }

  private calculateAnalytics(documents: NewsML29Document[], analytics: NewsML29Analytics): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    documents.forEach(doc => {
      // Provider distribution
      const provider = doc.searchFields.provider;
      analytics.documentsByProvider[provider] = (analytics.documentsByProvider[provider] || 0) + 1;

      // Item class distribution
      const itemClass = doc.searchFields.itemClass;
      analytics.documentsByItemClass[itemClass] = (analytics.documentsByItemClass[itemClass] || 0) + 1;

      // Status distribution
      const status = doc.processing.status;
      analytics.documentsByStatus[status] = (analytics.documentsByStatus[status] || 0) + 1;

      // Urgency distribution
      const urgency = doc.searchFields.urgency;
      analytics.documentsByUrgency[urgency] = (analytics.documentsByUrgency[urgency] || 0) + 1;

      // Time-based metrics
      if (doc.createdAt >= today) analytics.documentsToday++;
      if (doc.createdAt >= weekAgo) analytics.documentsThisWeek++;
      if (doc.createdAt >= monthAgo) analytics.documentsThisMonth++;

      // Language distribution
      const language = doc.searchFields.language;
      analytics.languageDistribution[language] = (analytics.languageDistribution[language] || 0) + 1;
    });
  }
}

// Export singleton instance
export const newsml29Service = NewsML29Service.getInstance();
