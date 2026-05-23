// ==========================================================================
// FARMER COMMUNITY NETWORK - Fully Working
// ==========================================================================

// Use a consistent storage key that persists across sessions
const COMMUNITY_STORAGE_KEY = 'mimeahub_community_data';
let communityReports = [];
let currentRating = 0;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function initCommunity() {
    console.log('Initializing community...');
    loadCommunityReports();
}

// ==========================================================================
// LOAD & SAVE
// ==========================================================================
function loadCommunityReports() {
    try {
        const stored = localStorage.getItem(COMMUNITY_STORAGE_KEY);
        communityReports = stored ? JSON.parse(stored) : [];
        console.log('Loaded community reports:', communityReports.length);
    } catch (e) {
        console.error('Failed to load community reports:', e);
        communityReports = [];
    }
    displayCommunityReports();
    updateCommunityCount();
}

function saveCommunityReports() {
    try {
        localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(communityReports));
        console.log('Saved community reports:', communityReports.length);
    } catch (e) {
        console.error('Failed to save community reports:', e);
        alert('Storage full. Please clear some data.');
    }
}

// ==========================================================================
// DISPLAY REPORTS
// ==========================================================================
function displayCommunityReports(filter = 'all') {
    const container = document.getElementById('community-reports');
    if (!container) {
        console.error('Community reports container not found');
        return;
    }
    
    let reports = [...communityReports].reverse();
    
    if (filter !== 'all') {
        reports = reports.filter(r => r.crop === filter);
    }
    
    if (reports.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <div style="font-size:32px; margin-bottom:8px;">🌱</div>
                <p style="color:var(--text-secondary); font-size:12px; margin:0;">No reports yet</p>
                <p style="color:var(--text-secondary); font-size:11px; margin:4px 0 0 0;">Share your first report!</p>
            </div>`;
        return;
    }
    
    container.innerHTML = reports.map(report => createReportHTML(report)).join('');
}

function createReportHTML(report) {
    const timeAgo = getTimeAgo(report.timestamp);
    const severityClass = getSeverityClass(report.disease);
    const stars = '★'.repeat(report.rating || 0) + '☆'.repeat(5 - (report.rating || 0));
    const helpfulCount = report.helpful || 0;
    
    return `
        <div class="community-report-card">
            <div class="report-header">
                <span class="report-crop">${getCropEmoji(report.crop)} ${report.crop}</span>
                <span class="report-time">${timeAgo}</span>
            </div>
            <div class="report-disease ${severityClass}">
                ${formatDiseaseName(report.disease)}
            </div>
            ${report.treatment ? `<div class="report-treatment">💊 ${report.treatment}</div>` : ''}
            <div class="report-rating">
                <span class="stars-display">${stars}</span>
                <span>(${report.rating || 0}/5)</span>
            </div>
            ${report.notes ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:4px;">📝 ${report.notes}</div>` : ''}
            <div class="report-footer">
                <span style="font-size:11px; color:var(--text-secondary);">📍 ${report.location || 'Unknown'}</span>
                <button class="helpful-btn" onclick="markHelpful(${report.id})" style="font-size:11px;">
                    👍 ${helpfulCount}
                </button>
            </div>
        </div>
    `;
}

// ==========================================================================
// TAB SWITCHING
// ==========================================================================
function switchCommunityTab(tab) {
    const nearbyTab = document.querySelectorAll('.tab')[0];
    const shareTab = document.querySelectorAll('.tab')[1];
    const nearbyContent = document.getElementById('community-nearby');
    const shareContent = document.getElementById('community-share');
    
    if (!nearbyTab || !shareTab || !nearbyContent || !shareContent) return;
    
    if (tab === 'nearby') {
        nearbyTab.classList.add('active');
        shareTab.classList.remove('active');
        nearbyContent.classList.remove('hidden');
        shareContent.classList.add('hidden');
    } else {
        shareTab.classList.add('active');
        nearbyTab.classList.remove('active');
        shareContent.classList.remove('hidden');
        nearbyContent.classList.add('hidden');
    }
}

// ==========================================================================
// RATING SYSTEM
// ==========================================================================
function setRating(rating) {
    currentRating = rating;
    const ratingInput = document.getElementById('share-rating');
    if (ratingInput) ratingInput.value = rating;
    
    const stars = document.querySelectorAll('.stars span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

// ==========================================================================
// SHARE REPORT
// ==========================================================================
function shareCommunityReport() {
    const cropEl = document.getElementById('share-crop');
    const diseaseEl = document.getElementById('share-disease');
    const treatmentEl = document.getElementById('share-treatment');
    const ratingEl = document.getElementById('share-rating');
    const notesEl = document.getElementById('share-notes');
    
    if (!cropEl || !diseaseEl || !treatmentEl) {
        console.error('Share form elements not found');
        return;
    }
    
    const crop = cropEl.value;
    const disease = diseaseEl.value;
    const treatment = treatmentEl.value.trim();
    const rating = parseInt(ratingEl?.value || '0');
    const notes = notesEl?.value?.trim() || '';
    
    if (!treatment) {
        alert('Please enter the treatment you used.');
        return;
    }
    
    if (rating === 0) {
        alert('Please rate the treatment effectiveness.');
        return;
    }
    
    // Get current user info
    const user = window.auth?.getUserData?.();
    
    const report = {
        id: Date.now(),
        crop: crop,
        disease: disease,
        treatment: treatment,
        rating: rating,
        notes: notes,
        helpful: 0,
        helpfulUsers: [],
        location: window.currentGPS || 'Unknown',
        timestamp: new Date().toISOString(),
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous Farmer'
    };
    
    communityReports.push(report);
    saveCommunityReports();
    
    // Clear form
    treatmentEl.value = '';
    if (notesEl) notesEl.value = '';
    setRating(0);
    
    // Refresh display
    displayCommunityReports();
    updateCommunityCount();
    switchCommunityTab('nearby');
    
    // Show success
    showNotification('Report shared successfully! 📤');
}

// ==========================================================================
// HELPFUL VOTES
// ==========================================================================
function markHelpful(reportId) {
    const report = communityReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Get current user ID
    const user = window.auth?.getUserData?.();
    const userId = user?.id || 'anonymous_' + Date.now();
    
    if (!report.helpfulUsers) report.helpfulUsers = [];
    if (!report.helpful) report.helpful = 0;
    
    if (report.helpfulUsers.includes(userId)) {
        // Already voted
        return;
    }
    
    report.helpful++;
    report.helpfulUsers.push(userId);
    saveCommunityReports();
    displayCommunityReports();
}

// ==========================================================================
// UPDATE COUNT
// ==========================================================================
function updateCommunityCount() {
    const countEl = document.getElementById('community-count');
    if (countEl) {
        countEl.textContent = communityReports.length;
    }
}

// ==========================================================================
// NOTIFICATION
// ==========================================================================
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================
function getTimeAgo(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000);
    
    if (isNaN(diff)) return 'Unknown';
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return then.toLocaleDateString();
}

function getSeverityClass(disease) {
    if (!disease) return 'disease-severity-low';
    if (disease.includes('blight') || disease.includes('wilt')) return 'disease-severity-high';
    if (disease.includes('spot') || disease.includes('rust')) return 'disease-severity-medium';
    return 'disease-severity-low';
}

function formatDiseaseName(disease) {
    if (!disease) return 'Unknown';
    return disease.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getCropEmoji(crop) {
    const emojis = { 
        'tomato': '🍅', 
        'potato': '🥔', 
        'maize': '🌽', 
        'beans': '🫘', 
        'other': '🌱' 
    };
    return emojis[crop] || '🌿';
}

// ==========================================================================
// AUTO-INIT
// ==========================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunity);
} else {
    // DOM already loaded, wait a bit for other scripts
    setTimeout(initCommunity, 500);
}