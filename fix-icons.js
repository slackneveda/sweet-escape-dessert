const fs = require('fs');
const path = require('path');

// Icon mappings from Phosphor to Lucide
const iconMappings = {
  // Common problematic icons
  'List': 'Menu',
  'Cake': 'Coffee', // or ChefHat, no direct cake icon
  'ShoppingCart': 'ShoppingCart',
  'ShoppingCartSimple': 'ShoppingCart', 
  'ShoppingBag': 'ShoppingBag',
  'ShoppingBagOpen': 'ShoppingBag',
  'Mail': 'Mail',
  'Envelope': 'Mail',
  'LogOut': 'LogOut',
  'SignOut': 'LogOut',
  'Trash': 'Trash2',
  'TrashSimple': 'Trash2',
  'MessageSquare': 'MessageSquare',
  'ChatCenteredText': 'MessageSquare',
  'Warning': 'AlertTriangle',
  'WarningCircle': 'AlertTriangle',
  'Shield': 'Shield',
  'ShieldCheck': 'ShieldCheck',
  'CreditCard': 'CreditCard',
  'MapPin': 'MapPin',
  'Phone': 'Phone',
  'Clock': 'Clock',
  'CheckCircle': 'CheckCircle',
  'CheckCircle2': 'CheckCircle2',
  'XCircle': 'XCircle',
  'User': 'User',
  'Lock': 'Lock',
  'Eye': 'Eye',
  'EyeSlash': 'EyeOff',
  'Star': 'Star',
  'Plus': 'Plus',
  'Minus': 'Minus',
  'X': 'X',
  'Check': 'Check',
  'ArrowRight': 'ArrowRight',
  'Sun': 'Sun',
  'Moon': 'Moon',
  'TrendingUp': 'TrendingUp',
  'Crown': 'Crown',
  'Package': 'Package',
  'Truck': 'Truck',
  'AlertCircle': 'AlertCircle',
  'Zap': 'Zap',
  'Lightning': 'Zap',
  'Activity': 'Activity',
  'Server': 'Server',
  'Globe': 'Globe',
  'Copy': 'Copy',
  'Code': 'Code',
  'Play': 'Play',
  'Terminal': 'Terminal',
  'BookOpen': 'BookOpen',
  'ExternalLink': 'ExternalLink',
  'Lightbulb': 'Lightbulb',
  'PlayCircle': 'PlayCircle',
  'Webhook': 'Webhook',
  'Navigation': 'Navigation'
};

function processFile(filePath) {
  if (!fs.existsSync(filePath) || !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file uses phosphor icons
  if (content.includes('@phosphor-icons/react')) {
    console.log(`Processing: ${filePath}`);
    
    // Extract current phosphor imports
    const phosphorImportMatch = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@phosphor-icons\/react['"]/);
    if (phosphorImportMatch) {
      const currentIcons = phosphorImportMatch[1].split(',').map(s => s.trim());
      const lucideIcons = [];
      const remainingPhosphorIcons = [];
      
      currentIcons.forEach(icon => {
        if (iconMappings[icon]) {
          lucideIcons.push(iconMappings[icon]);
          // Replace icon usage in content
          const regex = new RegExp(`<${icon}\\s`, 'g');
          content = content.replace(regex, `<${iconMappings[icon]} `);
          modified = true;
        } else {
          remainingPhosphorIcons.push(icon);
        }
      });
      
      // Update imports
      let newImports = '';
      if (lucideIcons.length > 0) {
        newImports += `import { ${[...new Set(lucideIcons)].join(', ')} } from 'lucide-react'\n`;
      }
      if (remainingPhosphorIcons.length > 0) {
        newImports += `import { ${remainingPhosphorIcons.join(', ')} } from '@phosphor-icons/react'\n`;
      }
      
      content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s*['"]@phosphor-icons\/react['"]/, newImports.trim());
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && item.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

// Process the src directory
const srcDir = path.join(__dirname, 'src');
console.log('Starting icon migration...');
processDirectory(srcDir);
console.log('Icon migration complete!');
