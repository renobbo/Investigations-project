document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const checkButton = document.getElementById('check-button');
    const resultDiv = document.getElementById('result');
    
    checkButton.addEventListener('click', () => {
        checkLink();
    });
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkLink();
        }
    });
    
    function checkLink() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a URL to check');
            return;
        }
        
        // Show loading state
        checkButton.disabled = true;
        checkButton.textContent = 'Checking...';
        resultDiv.style.display = 'none';
        
        // Simulate API call and processing time
        setTimeout(() => {
            const result = analyzeURL(url);
            displayResult(result);
            
            // Reset button state
            checkButton.disabled = false;
            checkButton.textContent = 'Check';
        }, 1500);
    }
    
    function analyzeURL(url) {
        // URL Validation Algorithm
        if (!isValidURL(url)) {
            return {
                status: 'warning',
                title: 'Invalid URL Format',
                message: 'The URL you entered does not appear to be properly formatted.'
            };
        }
        
        // Blacklist & String Matching Algorithms
        const blacklistResult = checkBlacklist(url);
        if (blacklistResult.blocked) {
            return {
                status: 'unsafe',
                title: 'Unsafe Link',
                message: 'This URL matches patterns associated with malicious activities.'
            };
        }
        
        // For demo purposes, we'll return safe for most URLs
        // In a real implementation, this would call the Google Safe Browsing API
        return {
            status: 'safe',
            title: 'Safe Link',
            message: 'No suspicious patterns or known threats were detected.'
        };
    }
    
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function checkBlacklist(url) {
        // String matching algorithm (simplified for demo)
        const lowercaseURL = url.toLowerCase();
        
        // Check for obvious phishing/malicious patterns
        const suspiciousPatterns = [
            'phishing',
            'free-gift',
            'account-verify',
            'login-secure',
            'malware',
            'download-now',
            '-free-',
            'win-prize'
        ];
        
        for (const pattern of suspiciousPatterns) {
            if (lowercaseURL.includes(pattern)) {
                return {
                    blocked: true,
                    reason: `Suspicious keyword detected: "${pattern}"`
                };
            }
        }
        
        // Demo blacklist
        const blacklistedDomains = [
            'evil-site.com',
            'malware-download.net',
            'phishing-attempt.org',
            'fake-bank.com'
        ];
        
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            if (blacklistedDomains.includes(domain)) {
                return {
                    blocked: true,
                    reason: 'Domain is on our blacklist of known malicious sites'
                };
            }
            
            // Suspicious TLDs (for demo purposes)
            const suspiciousTLDs = ['.xyz', '.tk', '.top', '.gq', '.ml'];
            if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
                return {
                    blocked: true,
                    reason: `Domain uses a potentially suspicious TLD: ${domain.split('.').pop()}`
                };
            }
        } catch (e) {
            // URL parsing failed, already caught by isValidURL
        }
        
        return { blocked: false };
    }
    
    function displayResult(result) {
        resultDiv.className = result.status;
        
        let iconSVG = '';
        switch (result.status) {
            case 'safe':
                iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                break;
            case 'unsafe':
                iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                break;
            case 'warning':
                iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                break;
        }
        
        resultDiv.innerHTML = `
            <div class="result-title">
                ${iconSVG}
                ${result.title}
            </div>
            <div class="result-message">${result.message}</div>
        `;
        
        resultDiv.style.display = 'block';
    }
});