import React, { useState } from 'react';

const ResumeBuilder = () => {
  const [sections, setSections] = useState([
    { id: 1, name: 'Education', enabled: true, description: 'Your educational background' },
    { id: 2, name: 'Experience', enabled: true, description: 'Your work experience' },
    { id: 3, name: 'Skills', enabled: true, description: 'Your skills and competencies' },
    // Add more sections as needed
  ]);

  const [draggedSection, setDraggedSection] = useState(null);
  const [isSaved, setIsSaved] = useState(true);

  const handleDragStart = (section) => {
    setDraggedSection(section);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetSection) => {
    const updatedSections = [...sections];
    const draggedIndex = updatedSections.findIndex((section) => section === draggedSection);
    const targetIndex = updatedSections.findIndex((section) => section === targetSection);

    updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(targetIndex, 0, draggedSection);

    setSections(updatedSections);
    setDraggedSection(null);
    setIsSaved(false);
  };

  const handleSectionNameChange = (sectionId, newName) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, name: newName };
      }
      return section;
    });

    setSections(updatedSections);
    setIsSaved(false);
  };

  const handleToggleSection = (sectionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, enabled: !section.enabled };
      }
      return section;
    });

    setSections(updatedSections);
    setIsSaved(false);
  };

  const handleSave = () => {
    // Perform saving logic here
    setIsSaved(true);
  };

  return (
    <div>
      <h1>Resume Builder</h1>
      {sections.map((section) => (
        <div key={section.id} className="section">
          <div className="section-header">
            <button
              className="drag-handle"
              draggable
              onDragStart={() => handleDragStart(section)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(section)}
            >
              Drag
            </button>
            <input
              type="text"
              value={section.name}
              onChange={(event) => handleSectionNameChange(section.id, event.target.value)}
            />
            <button className="edit-button">Edit</button>
            <button className="toggle-button" onClick={() => handleToggleSection(section.id)}>
              {section.enabled ? 'On' : 'Off'}
            </button>
            <button className="description-button">Description</button>
          </div>
          {section.enabled && <div className="section-content">{section.description}</div>}
        </div>
      ))}
      <button className="save-button" disabled={isSaved} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default ResumeBuilder;
