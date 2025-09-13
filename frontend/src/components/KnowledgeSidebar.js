import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Leaf, Droplets, Sun, Thermometer, CloudRain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './KnowledgeSidebar.css';

const KnowledgeSidebar = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const knowledgeData = {
    soilBasics: {
      title: t.soilBasics,
      icon: <Leaf size={16} />,
      content: t.soilBasicsContent
    },
    nutrients: {
      title: t.essentialNutrients,
      icon: <Droplets size={16} />,
      content: t.essentialNutrientsContent
    },
    climate: {
      title: t.climateFactors,
      icon: <Sun size={16} />,
      content: t.climateFactorsContent
    },
    cropTypes: {
      title: t.cropCategories,
      icon: <Thermometer size={16} />,
      content: t.cropCategoriesContent
    },
    tips: {
      title: t.farmingTips,
      icon: <CloudRain size={16} />,
      content: t.farmingTipsContent
    }
  };

  const cropInfo = {
    rice: { name: "Rice", desc: t.riceDesc, conditions: t.riceConditions },
    maize: { name: "Maize", desc: t.maizeDesc, conditions: t.maizeConditions },
    chickpea: { name: "Chickpea", desc: t.chickpeaDesc, conditions: t.chickpeaConditions },
    banana: { name: "Banana", desc: t.bananaDesc, conditions: t.bananaConditions },
    cotton: { name: "Cotton", desc: t.cottonDesc, conditions: t.cottonConditions }
  };

  return (
    <div className="knowledge-sidebar">
      <div className="sidebar-header">
        <BookOpen size={20} />
        <h3>{t.agriculturalKnowledge}</h3>
      </div>

      <div className="knowledge-sections">
        {Object.entries(knowledgeData).map(([key, section]) => (
          <div key={key} className="knowledge-section">
            <div 
              className="section-header"
              onClick={() => toggleSection(key)}
            >
              {expandedSections[key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              {section.icon}
              <span>{section.title}</span>
            </div>
            {expandedSections[key] && (
              <div className="section-content">
                <ul>
                  {section.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="crop-quick-info">
        <h4>{t.quickCropInfo}</h4>
        <div className="crop-cards">
          {Object.entries(cropInfo).map(([key, crop]) => (
            <div key={key} className="crop-card">
              <div className="crop-name">{crop.name}</div>
              <div className="crop-desc">{crop.desc}</div>
              <div className="crop-conditions">{crop.conditions}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <p>{t.chatbotTip}</p>
      </div>
    </div>
  );
};

export default KnowledgeSidebar;
