import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

async function fixFirebaseNullChecks() {
  // Find all relevant files
  const files = await glob('src/components/**/*NewsGrid*.tsx', { ignore: 'node_modules/**' });
  const kpiFiles = await glob('src/components/**/*KpiWidget*.tsx', { ignore: 'node_modules/**' });
  const videoPanelFiles = await glob('src/components/**/*VideoPanel*.tsx', { ignore: 'node_modules/**' });
  
  const allFiles = [...files, ...kpiFiles, ...videoPanelFiles];
  
  for (const file of allFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      
      // Skip if already has null check
      if (content.includes('if (!db) return;')) {
        console.log(`Skipping ${file} - already has null check`);
        continue;
      }
      
      // Add null check after useEffect
      const patterns = [
        /(\s+useEffect\(\(\) => \{)\n(\s+)(const q = query\(\s*collection\(db,)/g,
        /(\s+useEffect\(\(\) => \{)\n(\s+)(const [a-zA-Z]+Q = query\(\s*collection\(db,)/g,
        /(\s+useEffect\(\(\) => \{)\n(\s+)(collection\(db,)/g
      ];
      
      let updatedContent = content;
      let wasUpdated = false;
      
      for (const pattern of patterns) {
        const newContent = updatedContent.replace(pattern, 
          '$1\n$2if (!db) return;\n$2\n$2$3'
        );
        if (newContent !== updatedContent) {
          updatedContent = newContent;
          wasUpdated = true;
          break;
        }
      }
      
      if (wasUpdated) {
        await writeFile(file, updatedContent);
        console.log(`Fixed ${file}`);
      } else {
        console.log(`No pattern matched for ${file}`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
}

fixFirebaseNullChecks().catch(console.error);
