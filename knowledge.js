// ==========================================================================
// OFFLINE KNOWLEDGE BASE
// ==========================================================================

const knowledgeBase = [
    {
        id: 1,
        crop: 'tomato',
        disease: 'Tomato Late Blight',
        scientificName: 'Phytophthora infestans',
        category: 'disease',
        icon: '🍅',
        symptoms: 'Dark, water-soaked spots on leaves that quickly enlarge. White fuzzy growth on leaf undersides in humid conditions. Brown lesions on stems and fruit rot.',
        causes: 'Caused by a fungus-like organism that thrives in cool, wet weather (60-75°F). Spreads rapidly in high humidity.',
        organicTreatment: [
            'Apply copper-based fungicides every 7-10 days',
            'Use baking soda spray (1 tbsp baking soda + 1 tsp liquid soap + 1 gallon water)',
            'Apply neem oil solution weekly',
            'Remove and destroy infected plants immediately'
        ],
        chemicalTreatment: [
            'Chlorothalonil (Bravo) - Apply every 7-14 days',
            'Mancozeb - Apply preventively before disease appears',
            'Ridomil Gold - Systemic fungicide for severe infections',
            'Azoxystrobin - Apply at first sign of disease'
        ],
        prevention: [
            'Plant resistant varieties when available',
            'Ensure proper spacing (2-3 feet between plants)',
            'Water at base of plants, avoid wetting foliage',
            'Mulch around plants to prevent soil splash',
            'Rotate crops - don\'t plant tomatoes in same spot for 3 years',
            'Stake plants to improve air circulation'
        ],
        imagePlaceholder: '🍅🦠'
    },
    {
        id: 2,
        crop: 'potato',
        disease: 'Potato Early Blight',
        scientificName: 'Alternaria solani',
        category: 'disease',
        icon: '🥔',
        symptoms: 'Dark brown spots with concentric rings (target spots) on older leaves first. Yellowing around spots. Lesions on stems and tubers.',
        causes: 'Fungal disease that develops in warm, humid conditions. Spreads through infected plant debris and soil.',
        organicTreatment: [
            'Apply neem oil extract every 7 days',
            'Use garlic spray (blend garlic cloves with water, strain, spray)',
            'Apply compost tea to boost plant immunity',
            'Remove infected leaves promptly'
        ],
        chemicalTreatment: [
            'Chlorothalonil - Apply at first sign of disease',
            'Azoxystrobin - Effective systemic treatment',
            'Mancozeb - Protective fungicide',
            'Copper-based fungicides for organic certification'
        ],
        prevention: [
            'Use certified disease-free seed potatoes',
            'Practice 3-year crop rotation',
            'Avoid overhead irrigation',
            'Harvest when vines are dry',
            'Remove plant debris after harvest',
            'Maintain proper soil fertility'
        ],
        imagePlaceholder: '🥔🦠'
    },
    {
        id: 3,
        crop: 'tomato',
        disease: 'Healthy Tomato Plant',
        scientificName: 'Solanum lycopersicum',
        category: 'healthy',
        icon: '🍅',
        symptoms: 'Vibrant green leaves without spots or discoloration. Strong stems with normal growth. Regular flowering and fruit development.',
        causes: 'Good agricultural practices and favorable growing conditions.',
        organicTreatment: [
            'Continue regular composting',
            'Maintain beneficial insect habitat',
            'Apply organic mulch to retain moisture'
        ],
        chemicalTreatment: [
            'No chemical treatment needed for healthy plants',
            'Optional: Foliar feed with balanced fertilizer'
        ],
        prevention: [
            'Monitor weekly for early signs of pests or disease',
            'Maintain consistent watering schedule',
            'Prune for good air circulation',
            'Test soil annually for nutrient levels'
        ],
        imagePlaceholder: '🍅✅'
    },
    {
        id: 4,
        crop: 'general',
        disease: 'General Disease Prevention Guide',
        scientificName: 'N/A',
        category: 'prevention',
        icon: '🛡️',
        symptoms: 'Prevention is better than cure. Look for early warning signs: leaf discoloration, stunted growth, unusual spots or patches.',
        causes: 'Various pathogens including fungi, bacteria, viruses, and environmental stress.',
        organicTreatment: [
            'Build healthy soil with compost and organic matter',
            'Use companion planting (e.g., marigolds with tomatoes)',
            'Introduce beneficial insects like ladybugs',
            'Apply organic mulches'
        ],
        chemicalTreatment: [
            'Use chemicals as last resort',
            'Always follow label instructions',
            'Wear protective equipment when applying',
            'Observe pre-harvest intervals'
        ],
        prevention: [
            'Practice crop rotation',
            'Use disease-resistant varieties',
            'Maintain proper plant spacing',
            'Water early in the day',
            'Keep garden tools clean',
            'Remove infected plants immediately',
            'Monitor crops regularly'
        ],
        imagePlaceholder: '🛡️🌱'
    },
    {
        id: 5,
        crop: 'maize',
        disease: 'Maize Streak Virus',
        scientificName: 'Maize streak mastrevirus',
        category: 'disease',
        icon: '🌽',
        symptoms: 'White to yellow streaks along leaf veins. Stunted growth. Reduced cob size and grain yield.',
        causes: 'Transmitted by leafhoppers. More common in warm seasons with high insect populations.',
        organicTreatment: [
            'Remove infected plants to prevent spread',
            'Use reflective mulches to repel leafhoppers',
            'Plant barrier crops around maize fields',
            'Apply neem-based repellents'
        ],
        chemicalTreatment: [
            'Systemic insecticides for leafhopper control',
            'Imidacloprid seed treatment',
            'Apply insecticides early in season'
        ],
        prevention: [
            'Plant resistant maize varieties',
            'Early planting to avoid peak leafhopper season',
            'Remove volunteer maize plants',
            'Control weeds that host leafhoppers',
            'Use trap crops like Napier grass'
        ],
        imagePlaceholder: '🌽🦠'
    }
];

let currentKnowledgeFilter = 'all';

// Render knowledge base cards
function renderKnowledgeBase(filter = 'all', searchQuery = '') {
    const container = document.getElementById('knowledge-list');
    if (!container) return;
    
    let items = [...knowledgeBase];
    
    // Apply category filter
    if (filter !== 'all') {
        items = items.filter(item => item.crop === filter || item.category === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item => 
            item.disease.toLowerCase().includes(query) ||
            item.crop.toLowerCase().includes(query) ||
            item.symptoms.toLowerCase().includes(query) ||
            item.causes.toLowerCase().includes(query)
        );
    }
    
    if (items.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); font-size: 13px; text-align: center; padding: 20px;">No results found. Try different search terms.</p>`;
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="knowledge-card-item" onclick="toggleKnowledgeCard(this)" data-id="${item.id}">
            <div class="knowledge-card-header">
                <div class="knowledge-title">
                    <span>${item.icon}</span>
                    <span>${item.disease}</span>
                    <span class="knowledge-crop-tag">${item.crop.toUpperCase()}</span>
                </div>
                <span class="knowledge-expand-icon">▼</span>
            </div>
            <div class="knowledge-details">
                <div class="knowledge-image-placeholder">
                    ${item.imagePlaceholder}
                </div>
                
                ${item.scientificName !== 'N/A' ? `
                <div class="knowledge-section">
                    <h5>🔬 Scientific Name</h5>
                    <p><em>${item.scientificName}</em></p>
                </div>` : ''}
                
                <div class="knowledge-section">
                    <h5>🔍 Symptoms</h5>
                    <p>${item.symptoms}</p>
                </div>
                
                <div class="knowledge-section">
                    <h5>⚠️ Causes</h5>
                    <p>${item.causes}</p>
                </div>
                
                <div class="knowledge-section">
                    <h5>🌿 Organic Treatment</h5>
                    <ul style="list-style: none; padding: 0;">
                        ${item.organicTreatment.map(t => `<li style="padding: 4px 0; font-size: 13px; color: var(--text-secondary);">• ${t}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="knowledge-section">
                    <h5>🧪 Chemical Treatment</h5>
                    <ul style="list-style: none; padding: 0;">
                        ${item.chemicalTreatment.map(t => `<li style="padding: 4px 0; font-size: 13px; color: var(--text-secondary);">• ${t}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="knowledge-section">
                    <h5>🛡️ Prevention</h5>
                    <ul style="list-style: none; padding: 0;">
                        ${item.prevention.map(t => `<li style="padding: 4px 0; font-size: 13px; color: var(--text-secondary);">• ${t}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle knowledge card expansion
function toggleKnowledgeCard(card) {
    // Close all other cards
    document.querySelectorAll('.knowledge-card-item.expanded').forEach(item => {
        if (item !== card) {
            item.classList.remove('expanded');
        }
    });
    
    // Toggle current card
    card.classList.toggle('expanded');
}

// Filter knowledge base by category
function filterKnowledge(category) {
    currentKnowledgeFilter = category;
    
    // Update active pill
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.textContent.toLowerCase().includes(category) || 
            (category === 'all' && pill.textContent === 'All')) {
            pill.classList.add('active');
        }
    });
    
    const searchQuery = document.getElementById('knowledge-search')?.value || '';
    renderKnowledgeBase(category, searchQuery);
}

// Initialize knowledge base
function initKnowledgeBase() {
    renderKnowledgeBase();
    
    // Setup search
    const searchInput = document.getElementById('knowledge-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderKnowledgeBase(currentKnowledgeFilter, e.target.value);
        });
    }
}

// Add to global initialization
document.addEventListener('DOMContentLoaded', () => {
    initCommunity();
    initKnowledgeBase();
});