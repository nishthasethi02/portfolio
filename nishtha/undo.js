const fs = require('fs');

const stylePath = 'c:\\Users\\Nishtha Sethi\\Downloads\\nishtha\\nishtha\\style.css';
let styleContent = fs.readFileSync(stylePath, 'utf8');

// Find the start of the mistake
const startMarker = "body.theme-coral.mode-light {\r\n    --bg-main: #f9fbf9;\r\n    --bg-glass: rgba(255, 255, 255, 0.7);\r\n    --border-glass: rgba(24, 36, 30, 0.15);\r\n    --accent-1: #cc5429;\r\n    --accent-2: #165e16;\r\n    --gradient-accent: linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%);\r\n    --text-light: #18241e;\r\n    --text-muted: #53645b;";

const targetToFind = "--text-muted: #53645b;";
const lastProperLineIndex = styleContent.indexOf(targetToFind, styleContent.indexOf("body.theme-coral.mode-light {"));

if (lastProperLineIndex !== -1) {
    const startIdx = lastProperLineIndex + targetToFind.length;
    // Find the end: just before "body {" where transition is
    const endMarkerRegex = /body\s*\{\s*transition:\s*background\s*0\.4s\s*ease,\s*color\s*0\.4s\s*ease;/;
    const endMatch = styleContent.match(endMarkerRegex);
    
    if (endMatch) {
         const endIdx = endMatch.index;
         
         const correctReplacement = "\r\n    --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n";
         
         const newStyle = styleContent.substring(0, startIdx) + correctReplacement + styleContent.substring(endIdx);
         
         // Also, the entire rest of the file following this got indented 4 spaces by VSCode! We should outdent it.
         // Let's just do a simple regex replace for lines starting with 4 spaces, but only after `endIdx`
         let beforeStr = newStyle.substring(0, startIdx + correctReplacement.length);
         let afterStr = newStyle.substring(startIdx + correctReplacement.length);
         
         afterStr = afterStr.replace(/(?:\r\n|\n)    /g, "\n"); // naive outdent
         
         fs.writeFileSync(stylePath, beforeStr + afterStr);
         console.log("Reverted style.css successfully");
    } else {
         console.log("Could not find end marker in style.css");
    }
} else {
    console.log("Could not find start marker in style.css");
}

// Restore index.html
const indexPath = 'c:\\Users\\Nishtha Sethi\\Downloads\\nishtha\\nishtha\\index.html';
const oldHeroContent = `    <!-- Hero Section -->
    <section id="hero" class="hero-section">
        <div class="container hero-content">
            <div class="hero-text-box">
                <p class="greeting">Hello, I'm</p>
                <h1 class="hero-title">Nishtha Sethi</h1>
                <h2 class="hero-subtitle"><span id="typed-text"></span><span class="cursor"></span></h2>
                <p class="hero-desc">
                    Detail-oriented professional specializing in Data Analysis, Data Modeling, and Data Visualization.
                    Passionate about solving complex problems through data-driven insights.
                </p>
                <div class="hero-actions">
                    <a href="#about" class="btn btn-primary">About Me</a>
                    <a href="file:///C:/Users/Nishtha%20Sethi/Downloads/nishu.pdf" target="_blank"
                        class="btn btn-secondary"><i class="fas fa-download"></i> Download CV</a>
                </div>
                <!-- Social Links -->
                <div class="social-links">
                    <a href="https://linkedin.com/in/sethinishtha/" target="_blank" aria-label="LinkedIn"><i
                            class="fab fa-linkedin-in"></i></a>
                    <a href="https://github.com/nishthasethi02" target="_blank" aria-label="GitHub"><i
                            class="fab fa-github"></i></a>
                    <a href="mailto:nishthasethi004@gmail.com" aria-label="Email"><i class="fas fa-envelope"></i></a>

                </div>
            </div>
            <div class="hero-image-box">
                <img src="Pic.jpeg" alt="Nishtha Sethi" class="profile-img">
            </div>
        </div>
    </section>`;

let indexContent = fs.readFileSync(indexPath, 'utf8');
const heroStartRegex = /<!-- Hero Section -->\s*<section id="hero" class="hero-section">\s*<div class="container hero-content-grid">/;
const heroEndRegex = /<\/div>\s*<\/section>/;

let startIndexMatch = indexContent.match(heroStartRegex);
if(startIndexMatch) {
    let subStr = indexContent.substring(startIndexMatch.index);
    let endIndexMatch = subStr.match(heroEndRegex);
    if(endIndexMatch) {
        let fullMatch = indexContent.substring(startIndexMatch.index, startIndexMatch.index + endIndexMatch.index + endIndexMatch[0].length);
        
        indexContent = indexContent.replace(fullMatch, oldHeroContent);
        fs.writeFileSync(indexPath, indexContent);
        console.log("Reverted index.html successfully");
    }
} else {
    console.log("Hero replacement not found in index.html");
}
