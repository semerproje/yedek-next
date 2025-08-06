// NewsML 2.9 Format Types for Firestore
export interface NewsML29Metadata {
  // Core NewsML 2.9 structure
  guid: string;
  version: string;
  standard: 'NewsML-G2';
  conformance: 'power';
  lang: string;
  xmlns: string;
}

export interface NewsML29Header {
  sent: string; // ISO datetime
  sender: string;
  transmitId: string;
  priority: number;
  origin: string;
  destination?: string;
}

export interface NewsML29ItemMeta {
  itemClass: 'ninat:text' | 'ninat:picture' | 'ninat:video' | 'ninat:audio' | 'ninat:composite';
  provider: string;
  versionCreated: string; // ISO datetime
  firstCreated: string; // ISO datetime
  pubStatus: 'usable' | 'withheld' | 'canceled';
  role: 'main' | 'sidebar' | 'related';
  generator: string;
  profile: string;
}

export interface NewsML29ContentMeta {
  urgency: number; // 1-9 scale
  headline: string;
  subheadline?: string;
  slug: string;
  byline?: string;
  creditline?: string;
  dateline?: string;
  language: string;
  subject: NewsML29Subject[];
  description: NewsML29Description[];
  keyword: string[];
  located: NewsML29Location[];
  creator: NewsML29Creator[];
  contributor: NewsML29Contributor[];
  audience: NewsML29Audience[];
}

export interface NewsML29Subject {
  type: 'cpnat:abstract' | 'cpnat:geoArea' | 'cpnat:organisation' | 'cpnat:person';
  qcode: string;
  name: string;
  why?: string;
  relevance?: number;
}

export interface NewsML29Description {
  role: 'summary' | 'caption' | 'note';
  text: string;
  lang?: string;
}

export interface NewsML29Location {
  type: 'cptype:city' | 'cptype:stateprov' | 'cptype:cntryarea';
  qcode: string;
  name: string;
  broader?: string;
}

export interface NewsML29Creator {
  uri?: string;
  name: string;
  jobtitle?: string;
  org?: string;
}

export interface NewsML29Contributor extends NewsML29Creator {
  contributorRole?: string;
}

export interface NewsML29Audience {
  significance: 'significant' | 'moderate' | 'low';
  audienceType: string;
}

export interface NewsML29ContentSet {
  inlineXML?: {
    html?: {
      body: {
        section: NewsML29Section[];
      };
    };
  };
  inlineData?: string;
  remoteContent?: {
    href: string;
    contenttype: string;
    size?: number;
  };
}

export interface NewsML29Section {
  class: 'main' | 'sidebar' | 'quote' | 'fact-box';
  role?: string;
  title?: string;
  content: NewsML29Content[];
}

export interface NewsML29Content {
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'media';
  text?: string;
  level?: number; // for headings
  items?: string[]; // for lists
  mediaRef?: string; // for media content
}

export interface NewsML29Rights {
  copyrightHolder: string;
  copyrightNotice: string;
  usageTerms: string;
  creditline?: string;
  source?: string;
}

export interface NewsML29AssociatedMedia {
  type: 'image' | 'video' | 'audio' | 'document';
  uri: string;
  title: string;
  description?: string;
  creditline?: string;
  rendition: NewsML29Rendition[];
}

export interface NewsML29Rendition {
  quality: 'preview' | 'thumbnail' | 'web' | 'print' | 'original';
  width?: number;
  height?: number;
  sizeInBytes?: number;
  contenttype: string;
  href: string;
}

// Main NewsML 2.9 Document Structure for Firestore
export interface NewsML29Document {
  // Firestore metadata
  id: string;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  
  // Source information (optional)
  source?: {
    provider: string;
    endpoint: string;
    receivedAt: Date;
    contentType: string;
    size: number;
  };
  
  // Processing options (optional)
  options?: {
    autoEnhance?: boolean;
    autoPublish?: boolean;
    skipValidation?: boolean;
    preserveRawXML?: boolean;
  };
  
  // NewsML 2.9 Core Structure
  newsml: {
    // XML namespaces and attributes
    metadata: NewsML29Metadata;
    
    // Header information
    header: NewsML29Header;
    
    // News item(s) - can contain multiple items
    newsItem: NewsML29NewsItem[];
  };
  
  // Processing status
  processing: {
    status: 'raw' | 'parsed' | 'enhanced' | 'published' | 'error';
    errors?: string[];
    warnings?: string[];
    lastProcessedAt?: Date;
  };
  
  // Firestore indexing fields
  searchFields: {
    headline: string;
    urgency: number;
    pubStatus: string;
    subjects: string[];
    keywords: string[];
    locations: string[];
    language: string;
    provider: string;
    itemClass: string;
  };
}

export interface NewsML29NewsItem {
  // Item identification
  guid: string;
  version: number;
  standard: string;
  standardversion: string;
  conformance: string;
  
  // Item metadata
  itemMeta: NewsML29ItemMeta;
  
  // Content metadata
  contentMeta: NewsML29ContentMeta;
  
  // Rights and usage
  rightsInfo?: NewsML29Rights;
  
  // Main content
  contentSet: NewsML29ContentSet;
  
  // Associated media
  associatedMedia?: NewsML29AssociatedMedia[];
  
  // Relationships to other items
  partOf?: string[]; // GUIDs of parent items
  sameAs?: string[]; // GUIDs of equivalent items
  replaces?: string; // GUID of replaced item
  replacedBy?: string; // GUID of replacement item
}

// Firestore Collection Schemas
export interface NewsML29Collection {
  // Main collection name
  name: 'newsml29_documents';
  
  // Document structure
  document: NewsML29Document;
  
  // Subcollections
  subcollections: {
    // News items as subcollection for better querying
    newsItems: {
      name: 'news_items';
      document: NewsML29NewsItem & {
        parentDocumentId: string;
      };
    };
    
    // Media assets as subcollection
    mediaAssets: {
      name: 'media_assets';
      document: NewsML29AssociatedMedia & {
        parentItemGuid: string;
        parentDocumentId: string;
      };
    };
    
    // Processing logs
    processingLogs: {
      name: 'processing_logs';
      document: {
        id: string;
        timestamp: Date;
        action: 'parsed' | 'enhanced' | 'published' | 'error';
        details: any;
        userId?: string;
        duration?: number;
      };
    };
  };
}

// Helper types for Firestore operations
export interface NewsML29Query {
  // Common query parameters
  urgency?: number | number[];
  pubStatus?: string | string[];
  provider?: string | string[];
  language?: string | string[];
  itemClass?: string | string[];
  subjects?: string | string[];
  keywords?: string | string[];
  locations?: string | string[];
  
  // Date ranges
  createdAfter?: Date;
  createdBefore?: Date;
  versionCreatedAfter?: Date;
  versionCreatedBefore?: Date;
  
  // Pagination
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'versionCreated' | 'urgency';
  orderDirection?: 'asc' | 'desc';
}

export interface NewsML29CreateInput {
  // Raw NewsML XML
  rawXML: string;
  
  // Source information
  source: {
    provider: string;
    endpoint: string;
    receivedAt: Date;
    contentType: string;
    size: number;
  };
  
  // Processing options
  options?: {
    autoEnhance?: boolean;
    autoPublish?: boolean;
    skipValidation?: boolean;
    preserveRawXML?: boolean;
  };
}

export interface NewsML29UpdateInput {
  // Only updatable fields
  processing?: Partial<NewsML29Document['processing']>;
  searchFields?: Partial<NewsML29Document['searchFields']>;
  
  // Versioning
  versionNote?: string;
  updatedBy?: string;
}

// Error types
export interface NewsML29Error {
  code: 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'ENHANCEMENT_ERROR' | 'PUBLISH_ERROR';
  message: string;
  field?: string;
  value?: any;
  severity: 'error' | 'warning' | 'info';
  timestamp: Date;
}

// Analytics and reporting types
export interface NewsML29Analytics {
  // Usage statistics
  totalDocuments: number;
  documentsByProvider: Record<string, number>;
  documentsByItemClass: Record<string, number>;
  documentsByStatus: Record<string, number>;
  documentsByUrgency: Record<string, number>;
  
  // Time-based metrics
  documentsToday: number;
  documentsThisWeek: number;
  documentsThisMonth: number;
  averageProcessingTime: number;
  
  // Content metrics
  topSubjects: Array<{ subject: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  languageDistribution: Record<string, number>;
}
