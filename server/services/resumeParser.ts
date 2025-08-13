export function parseResumeText(content: string): any {
  // Basic text parsing for common resume formats
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const parsed: any = {
    personalInfo: {},
    workExperience: [],
    projects: [],
    skills: [],
    education: []
  };

  let currentSection = '';
  let currentItem: any = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Detect sections
    if (lowerLine.includes('experience') || lowerLine.includes('employment')) {
      currentSection = 'experience';
      continue;
    } else if (lowerLine.includes('project')) {
      currentSection = 'projects';
      continue;
    } else if (lowerLine.includes('skill')) {
      currentSection = 'skills';
      continue;
    } else if (lowerLine.includes('education')) {
      currentSection = 'education';
      continue;
    }

    // Extract personal info from early lines
    if (parsed.personalInfo.name === undefined && line.length > 3 && !line.includes('@') && !line.includes('http')) {
      // Likely a name if it's near the top and doesn't contain email/url patterns
      const words = line.split(' ');
      if (words.length >= 2 && words.length <= 4 && words.every(w => /^[A-Za-z]+$/.test(w))) {
        parsed.personalInfo.name = line;
      }
    }

    // Extract email
    const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch) {
      parsed.personalInfo.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = line.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
    if (phoneMatch) {
      parsed.personalInfo.phone = phoneMatch[0];
    }

    // Process sections
    if (currentSection === 'experience') {
      // Look for company/position patterns
      if (line.includes('|') || line.includes('-') || /\d{4}/.test(line)) {
        if (currentItem) {
          parsed.workExperience.push(currentItem);
        }
        currentItem = { company: '', position: '', duration: '', description: [], technologies: [] };
        
        const parts = line.split(/[|\-–]/);
        if (parts.length >= 2) {
          currentItem.position = parts[0].trim();
          currentItem.company = parts[1].trim();
        }
        
        const yearMatch = line.match(/\d{4}/g);
        if (yearMatch) {
          currentItem.duration = yearMatch.join(' - ');
        }
      } else if (currentItem) {
        currentItem.description.push(line);
        
        // Extract technologies mentioned
        const techPatterns = /\b(JavaScript|Python|React|Node\.?js|Java|C\+\+|HTML|CSS|SQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|Git|TypeScript|Angular|Vue|Django|Flask|Express|Spring|\.NET|Ruby|PHP|Swift|Kotlin|Go|Rust)\b/gi;
        const matches = line.match(techPatterns);
        if (matches) {
          currentItem.technologies.push(...matches);
        }
      }
    } else if (currentSection === 'projects') {
      if (line.includes(':') || /\d{4}/.test(line)) {
        if (currentItem) {
          parsed.projects.push(currentItem);
        }
        currentItem = { name: '', description: '', technologies: [], year: '' };
        
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          currentItem.name = line.substring(0, colonIndex).trim();
          currentItem.description = line.substring(colonIndex + 1).trim();
        } else {
          currentItem.name = line;
        }
        
        const yearMatch = line.match(/\d{4}/);
        if (yearMatch) {
          currentItem.year = yearMatch[0];
        }
      } else if (currentItem) {
        currentItem.description += ' ' + line;
        
        // Extract technologies
        const techPatterns = /\b(JavaScript|Python|React|Node\.?js|Java|C\+\+|HTML|CSS|SQL|MongoDB|PostgreSQL|AWS|Docker|Kubernetes|Git|TypeScript|Angular|Vue|Django|Flask|Express|Spring|\.NET|Ruby|PHP|Swift|Kotlin|Go|Rust)\b/gi;
        const matches = line.match(techPatterns);
        if (matches) {
          currentItem.technologies.push(...matches);
        }
      }
    } else if (currentSection === 'skills') {
      // Extract skills from comma/bullet separated lists
      const skillMatches = line.split(/[,•·\-\*]/).map(s => s.trim()).filter(s => s.length > 0);
      parsed.skills.push(...skillMatches);
    } else if (currentSection === 'education') {
      if (currentItem) {
        parsed.education.push(currentItem);
      }
      currentItem = { institution: '', degree: '', year: '' };
      
      const yearMatch = line.match(/\d{4}/);
      if (yearMatch) {
        currentItem.year = yearMatch[0];
      }
      
      if (line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('institute')) {
        currentItem.institution = line;
      } else {
        currentItem.degree = line;
      }
    }
  }

  // Add final items
  if (currentSection === 'experience' && currentItem) {
    parsed.workExperience.push(currentItem);
  } else if (currentSection === 'projects' && currentItem) {
    parsed.projects.push(currentItem);
  } else if (currentSection === 'education' && currentItem) {
    parsed.education.push(currentItem);
  }

  // Clean up and deduplicate
  parsed.skills = Array.from(new Set(parsed.skills));
  parsed.workExperience.forEach((exp: any) => {
    exp.technologies = Array.from(new Set(exp.technologies));
    exp.description = exp.description.join(' ').trim();
  });
  parsed.projects.forEach((proj: any) => {
    proj.technologies = Array.from(new Set(proj.technologies));
  });

  return parsed;
}
