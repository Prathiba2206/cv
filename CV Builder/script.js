document.getElementById("name").addEventListener("input", function () {
    document.getElementById("preview-name").textContent = this.value || "Your Name";
});

document.getElementById("email").addEventListener("input", function () {
    document.getElementById("preview-email").textContent = this.value || "your.email@example.com";
});

document.getElementById("phone").addEventListener("input", function () {
    document.getElementById("preview-phone").textContent = this.value || "+1234567890";
});

document.getElementById("address").addEventListener("input", function () {
    document.getElementById("preview-address").textContent = this.value || "Your Address";
});

document.getElementById("summary").addEventListener("input", function () {
    document.getElementById("preview-summary").textContent = this.value || "Your professional summary goes here.";
});

document.getElementById("skills").addEventListener("input", function () {
    let skillsArray = this.value.split(",");
    let skillsList = document.getElementById("preview-skills");
    skillsList.innerHTML = "";
    skillsArray.forEach(skill => {
        if (skill.trim()) {
            let li = document.createElement("li");
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        }
    });
});

document.getElementById("experience").addEventListener("input", function () {
    document.getElementById("preview-experience").textContent = this.value || "Your work experience goes here.";
});

// Handle LinkedIn input
document.getElementById("linkedin").addEventListener("input", function () {
    const linkedinUrl = this.value || "Your LinkedIn profile";
    const linkedinPreview = document.getElementById("preview-linkedin");
    linkedinPreview.innerHTML = linkedinUrl ? 
        `<a href="${linkedinUrl}" target="_blank">${linkedinUrl}</a>` : 
        "Your LinkedIn profile";
});

// Handle Certificates upload
document.getElementById("certificates").addEventListener("change", function (e) {
    const files = e.target.files;
    const certList = document.getElementById("preview-certificates");
    certList.innerHTML = "";
    
    Array.from(files).forEach(file => {
        const li = document.createElement("li");
        li.textContent = file.name;
        certList.appendChild(li);
    });
});

// Handle Projects input
document.getElementById("projects").addEventListener("input", function () {
    document.getElementById("preview-projects").textContent = this.value || "Your projects description";
});

// Handle Profile Picture upload
document.getElementById("profile-pic").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById("preview-profile-pic");
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById("education").addEventListener("input", function () {
    document.getElementById("preview-education").textContent = this.value || "Your education details go here.";
});

function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF('p', 'mm', 'a4');
    
    // Set ATS-friendly font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    // Add header with contact information
    const name = document.getElementById("preview-name").textContent;
    const email = document.getElementById("preview-email").textContent;
    const phone = document.getElementById("preview-phone").textContent;
    const address = document.getElementById("preview-address").textContent;
    const linkedin = document.getElementById("preview-linkedin").textContent;
    
    // Add name as title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(name, 20, 20);
    
    // Add contact info
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const contactInfo = [
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Address: ${address}`,
        `LinkedIn: ${linkedin}`
    ].filter(info => info && !info.includes("undefined"));
    
    let contactY = 28;
    contactInfo.forEach(info => {
        doc.text(info, 20, contactY);
        contactY += 6;
    });
    
    // Add horizontal line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(20, contactY + 2, 190, contactY + 2);
    
    // Add sections
    const sections = [
        { 
            title: "Professional Summary", 
            content: document.getElementById("preview-summary").textContent 
        },
        { 
            title: "Skills", 
            content: Array.from(document.querySelectorAll("#preview-skills li"))
                .map(li => `• ${li.textContent}`).join("\n") 
        },
        { 
            title: "Work Experience", 
            content: document.getElementById("preview-experience").textContent 
        },
        { 
            title: "Education", 
            content: document.getElementById("preview-education").textContent 
        },
        { 
            title: "Projects", 
            content: document.getElementById("preview-projects").textContent 
        },
        { 
            title: "Certifications", 
            content: Array.from(document.querySelectorAll("#preview-certificates li"))
                .map(li => `• ${li.textContent}`).join("\n") 
        }
    ];
    
    let yPos = contactY + 10;
    sections.forEach(section => {
        if (section.content.trim()) {
            // Section title
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(section.title.toUpperCase(), 20, yPos);
            yPos += 8;
            
            // Section content
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            const lines = doc.splitTextToSize(section.content, 170);
            lines.forEach(line => {
                doc.text(line, 20, yPos);
                yPos += 6;
            });
            yPos += 8; // Extra space between sections
        }
    });

    // Add page numbers if needed
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' });
    }

    doc.save(`${name.replace(/ /g, '_')}_Resume.pdf`);
}
