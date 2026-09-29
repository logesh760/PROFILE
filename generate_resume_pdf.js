import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function generateResume() {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // Standard Letter page (612 x 792 points)
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const margin = 46;
  const contentWidth = width - margin * 2;
  let y = height - 42;

  // Colors
  const black = rgb(0.1, 0.1, 0.1);
  const darkGray = rgb(0.25, 0.25, 0.25);
  const ruleGray = rgb(0.3, 0.3, 0.3);

  function drawText(text, x, currentY, size, font, color = black) {
    page.drawText(text, { x, y: currentY, size, font, color });
  }

  function drawCenteredText(text, currentY, size, font, color = black) {
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (width - textWidth) / 2;
    page.drawText(text, { x, y: currentY, size, font, color });
  }

  function drawLine(currentY) {
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 0.8,
      color: ruleGray,
    });
  }

  function drawSectionHeader(title) {
    y -= 14;
    drawText(title, margin, y, 11, timesBold);
    y -= 3;
    drawLine(y);
    y -= 10;
  }

  // Header: Name
  drawCenteredText('LOGESHWARAN M', y, 19, timesBold);
  y -= 16;

  // Subtitle
  drawCenteredText('Computer Science and Engineering Student | Aspiring Java Full Stack Developer', y, 10.5, timesBold, darkGray);
  y -= 14;

  // Contact Info
  drawCenteredText('+91-7603993833  |  logeshwaranm180@gmail.com  |  linkedin.com/in/logeshwaranm', y, 9.5, timesRoman, darkGray);
  y -= 4;

  // SECTION: SUMMARY
  drawSectionHeader('SUMMARY');
  const summaryText = 'Final-year Computer Science student seeking a Fresher Java Full Stack Developer role. Quick learner with strong adaptability and problem-solving skills, hands-on project experience across Java, Spring Boot, and modern AI-assisted development tools, and a strong interest in building scalable, real-world software solutions.';
  
  // Wrap summary text
  const words = summaryText.split(' ');
  let line = '';
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    if (timesRoman.widthOfTextAtSize(testLine, 9.2) > contentWidth) {
      drawText(line, margin, y, 9.2, timesRoman);
      y -= 11.5;
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) {
    drawText(line, margin, y, 9.2, timesRoman);
    y -= 11.5;
  }

  // SECTION: SKILLS
  drawSectionHeader('SKILLS');
  
  const skillCategories = [
    { label: 'Languages & Frameworks: ', text: 'Java, Spring Boot, JavaScript, HTML5, CSS3, Bootstrap, Tailwind CSS, XML, C, MySQL, MongoDB' },
    { label: 'AI Development Tools: ', text: 'Google AI Studio, Antigravity, Supabase, Stitch' },
    { label: 'Databases: ', text: 'MySQL, MongoDB, Supabase' },
    { label: 'Deployment & Version Control: ', text: 'GitHub, Vercel, Render, Netlify' },
    { label: 'Core Concepts: ', text: 'Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management Systems (DBMS), REST APIs' }
  ];

  for (const cat of skillCategories) {
    const labelWidth = timesBold.widthOfTextAtSize(cat.label, 9);
    drawText(cat.label, margin, y, 9, timesBold);
    
    // wrap text
    const catWords = cat.text.split(' ');
    let catLine = '';
    let currentX = margin + labelWidth;
    let firstLine = true;

    for (const w of catWords) {
      const availableW = firstLine ? contentWidth - labelWidth : contentWidth - 14;
      const test = catLine + (catLine ? ' ' : '') + w;
      if (timesRoman.widthOfTextAtSize(test, 9) > availableW) {
        drawText(catLine, currentX, y, 9, timesRoman);
        y -= 11.5;
        firstLine = false;
        currentX = margin + 14;
        catLine = w;
      } else {
        catLine = test;
      }
    }
    if (catLine) {
      drawText(catLine, currentX, y, 9, timesRoman);
      y -= 12;
    }
  }

  // SECTION: PROJECTS
  drawSectionHeader('PROJECTS');

  // Project 1: LOKEY-AI
  drawText('LOKEY-AI', margin, y, 10, timesBold);
  const date1 = 'May 2026 – Jun 2026';
  drawText(date1, width - margin - timesRoman.widthOfTextAtSize(date1, 9), y, 9, timesItalic);
  y -= 11;
  drawText('React, Node.js, TypeScript, AI Integration, Vercel, Render', margin, y, 8.5, timesItalic, darkGray);
  y -= 11;

  const p1Bullets = [
    'Built an AI-powered student assistant that provides personalized academic guidance, study planning, and career support with multilingual capabilities.',
    'Developed a responsive conversational chat interface with memory to deliver context-aware, natural, and engaging interactions.',
    'Designed an intuitive user experience to help students clarify doubts, track learning progress, and receive AI-driven recommendations for academic success.'
  ];

  for (const b of p1Bullets) {
    drawText('•', margin + 6, y, 9, timesRoman);
    const bWords = b.split(' ');
    let bLine = '';
    let firstBLine = true;
    for (const w of bWords) {
      const avail = firstBLine ? contentWidth - 22 : contentWidth - 22;
      const test = bLine + (bLine ? ' ' : '') + w;
      if (timesRoman.widthOfTextAtSize(test, 8.8) > avail) {
        drawText(bLine, margin + 18, y, 8.8, timesRoman);
        y -= 11;
        firstBLine = false;
        bLine = w;
      } else {
        bLine = test;
      }
    }
    if (bLine) {
      drawText(bLine, margin + 18, y, 8.8, timesRoman);
      y -= 11.5;
    }
  }

  y -= 2;

  // Project 2: PlanX (V-OS Alpha)
  drawText('PlanX (V-OS Alpha)', margin, y, 10, timesBold);
  const date2 = 'Apr 2026 – May 2026';
  drawText(date2, width - margin - timesRoman.widthOfTextAtSize(date2, 9), y, 9, timesItalic);
  y -= 11;
  drawText('Kotlin, Jetpack Compose, Room Database, AI-Assisted Development', margin, y, 8.5, timesItalic, darkGray);
  y -= 11;

  const p2Bullets = [
    'Developed an offline-first personal workspace application that helps users manage productivity, notes, finances, fitness, and daily tasks through a unified dashboard.',
    'Implemented offline voice command support (English & Tamil), local file management, Pomodoro timer, secure note-taking, and personal finance tracking while ensuring user data remains private using local storage and Room Database.',
    'Designed a modular and customizable workspace interface with draggable productivity widgets, integrating AI-assisted development tools such as ChatGPT, Google AI Studio, and OpenRouter to accelerate UI design, feature planning, debugging, and development workflows.'
  ];

  for (const b of p2Bullets) {
    drawText('•', margin + 6, y, 9, timesRoman);
    const bWords = b.split(' ');
    let bLine = '';
    let firstBLine = true;
    for (const w of bWords) {
      const avail = firstBLine ? contentWidth - 22 : contentWidth - 22;
      const test = bLine + (bLine ? ' ' : '') + w;
      if (timesRoman.widthOfTextAtSize(test, 8.8) > avail) {
        drawText(bLine, margin + 18, y, 8.8, timesRoman);
        y -= 11;
        firstBLine = false;
        bLine = w;
      } else {
        bLine = test;
      }
    }
    if (bLine) {
      drawText(bLine, margin + 18, y, 8.8, timesRoman);
      y -= 11.5;
    }
  }

  y -= 2;

  // Project 3: Stock Trading Platform
  drawText('Stock Trading Platform', margin, y, 10, timesBold);
  y -= 11;
  drawText('Java, Object-Oriented Programming (OOP)', margin, y, 8.5, timesItalic, darkGray);
  y -= 11;

  const p3Bullets = [
    'Created a console-based stock trading simulation using Java.',
    'Implemented portfolio tracking and stock buy/sell features using core OOP principles.'
  ];

  for (const b of p3Bullets) {
    drawText('•', margin + 6, y, 9, timesRoman);
    drawText(b, margin + 18, y, 8.8, timesRoman);
    y -= 11.5;
  }

  // SECTION: INTERNSHIP
  drawSectionHeader('INTERNSHIP');

  // Internship 1
  drawText('Java Programming Intern | CodeAlpha', margin, y, 9.5, timesBold);
  const intDate1 = 'Dec 2025 – Jan 2026';
  drawText(intDate1, width - margin - timesRoman.widthOfTextAtSize(intDate1, 9), y, 9, timesItalic);
  y -= 11.5;
  drawText('•', margin + 6, y, 9, timesRoman);
  drawText('Strengthened Java programming and problem-solving skills through virtual internship projects.', margin + 18, y, 8.8, timesRoman);
  y -= 13;

  // Internship 2
  drawText('Java Programming Intern | CodSoft', margin, y, 9.5, timesBold);
  const intDate2 = 'Sep 2025 – Oct 2025';
  drawText(intDate2, width - margin - timesRoman.widthOfTextAtSize(intDate2, 9), y, 9, timesItalic);
  y -= 11.5;
  drawText('•', margin + 6, y, 9, timesRoman);
  drawText('Completed a Java programming internship and improved coding logic and development skills.', margin + 18, y, 8.8, timesRoman);
  y -= 12;

  // SECTION: CERTIFICATIONS
  drawSectionHeader('CERTIFICATIONS');

  const certs = [
    'Junior Grade Typewriting (English) – Government Technical Examinations',
    'Ideathon 2026 – Participation Certificate',
    'Machine Learning Workshop – Sona College of Technology | 27 February 2025'
  ];

  for (const c of certs) {
    drawText('•', margin + 6, y, 9, timesRoman);
    drawText(c, margin + 18, y, 8.8, timesRoman);
    y -= 11.5;
  }

  // SECTION: EDUCATION
  drawSectionHeader('EDUCATION');

  drawText('Bachelor of Engineering in Computer Science and Engineering', margin, y, 9.8, timesBold);
  const gradDate = 'Graduating: 2027';
  drawText(gradDate, width - margin - timesRoman.widthOfTextAtSize(gradDate, 9), y, 9, timesItalic);
  y -= 12;
  drawText('Mahendra Institute of Technology | CGPA: 8.11 / 10', margin, y, 9, timesRoman, darkGray);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('Logeshwaran_M.pdf', pdfBytes);
  fs.writeFileSync('Logeshwaran_Resume_Modern_Professional.pdf', pdfBytes);
  console.log('Successfully generated Logeshwaran_M.pdf and Logeshwaran_Resume_Modern_Professional.pdf');
}

generateResume().catch(err => {
  console.error('Failed to generate resume PDF:', err);
  process.exit(1);
});
