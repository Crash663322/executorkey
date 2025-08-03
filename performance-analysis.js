// Performance Analysis Script
// Run this in the browser console to analyze performance

(function() {
    'use strict';
    
    console.log('🚀 Performance Analysis Starting...');
    
    // 1. Bundle Size Analysis
    function analyzeBundleSize() {
        console.log('\n📦 Bundle Size Analysis:');
        
        // Calculate HTML size
        const htmlSize = document.documentElement.outerHTML.length;
        console.log(`HTML Size: ${(htmlSize / 1024).toFixed(2)} KB`);
        
        // Calculate CSS size (from style tags)
        const styleTags = document.querySelectorAll('style');
        let cssSize = 0;
        styleTags.forEach(style => {
            cssSize += style.textContent.length;
        });
        console.log(`Inline CSS Size: ${(cssSize / 1024).toFixed(2)} KB`);
        
        // Calculate JS size (from script tags)
        const scriptTags = document.querySelectorAll('script:not([src])');
        let jsSize = 0;
        scriptTags.forEach(script => {
            jsSize += script.textContent.length;
        });
        console.log(`Inline JS Size: ${(jsSize / 1024).toFixed(2)} KB`);
        
        const totalSize = htmlSize + cssSize + jsSize;
        console.log(`Total Bundle Size: ${(totalSize / 1024).toFixed(2)} KB`);
        
        return { htmlSize, cssSize, jsSize, totalSize };
    }
    
    // 2. Performance Metrics
    function analyzePerformanceMetrics() {
        console.log('\n⚡ Performance Metrics:');
        
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            if (navigation) {
                console.log(`DNS Lookup: ${navigation.domainLookupEnd - navigation.domainLookupStart}ms`);
                console.log(`TCP Connection: ${navigation.connectEnd - navigation.connectStart}ms`);
                console.log(`Server Response: ${navigation.responseEnd - navigation.responseStart}ms`);
                console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.navigationStart}ms`);
                console.log(`Page Load Complete: ${navigation.loadEventEnd - navigation.navigationStart}ms`);
                console.log(`First Paint: ${navigation.responseEnd - navigation.navigationStart}ms`);
            }
            
            // Custom performance marks
            const marks = performance.getEntriesByType('mark');
            if (marks.length > 0) {
                console.log('\n🎯 Custom Performance Marks:');
                marks.forEach(mark => {
                    console.log(`${mark.name}: ${mark.startTime.toFixed(2)}ms`);
                });
            }
            
            // Performance measures
            const measures = performance.getEntriesByType('measure');
            if (measures.length > 0) {
                console.log('\n📏 Performance Measures:');
                measures.forEach(measure => {
                    console.log(`${measure.name}: ${measure.duration.toFixed(2)}ms`);
                });
            }
        }
    }
    
    // 3. Resource Analysis
    function analyzeResources() {
        console.log('\n📄 Resource Analysis:');
        
        if ('performance' in window) {
            const resources = performance.getEntriesByType('resource');
            
            let totalTransferSize = 0;
            let totalEncodedSize = 0;
            let totalDecodedSize = 0;
            
            resources.forEach(resource => {
                totalTransferSize += resource.transferSize || 0;
                totalEncodedSize += resource.encodedBodySize || 0;
                totalDecodedSize += resource.decodedBodySize || 0;
                
                console.log(`${resource.name}: ${(resource.duration || 0).toFixed(2)}ms`);
            });
            
            console.log(`\nTotal Transfer Size: ${(totalTransferSize / 1024).toFixed(2)} KB`);
            console.log(`Total Encoded Size: ${(totalEncodedSize / 1024).toFixed(2)} KB`);
            console.log(`Total Decoded Size: ${(totalDecodedSize / 1024).toFixed(2)} KB`);
            
            if (totalEncodedSize > 0) {
                const compressionRatio = ((totalDecodedSize - totalEncodedSize) / totalDecodedSize * 100).toFixed(2);
                console.log(`Compression Ratio: ${compressionRatio}%`);
            }
        }
    }
    
    // 4. DOM Analysis
    function analyzeDOMComplexity() {
        console.log('\n🌳 DOM Complexity Analysis:');
        
        const allElements = document.querySelectorAll('*');
        console.log(`Total DOM Elements: ${allElements.length}`);
        
        const maxDepth = getMaxDepth(document.body);
        console.log(`Max DOM Depth: ${maxDepth}`);
        
        const styleElements = document.querySelectorAll('[style]');
        console.log(`Elements with inline styles: ${styleElements.length}`);
        
        function getMaxDepth(element) {
            let maxDepth = 0;
            
            function traverse(el, depth) {
                maxDepth = Math.max(maxDepth, depth);
                for (let child of el.children) {
                    traverse(child, depth + 1);
                }
            }
            
            traverse(element, 0);
            return maxDepth;
        }
    }
    
    // 5. Cache Analysis
    function analyzeCaching() {
        console.log('\n💾 Cache Analysis:');
        
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                console.log(`Service Worker Caches: ${cacheNames.length}`);
                cacheNames.forEach(name => {
                    console.log(`Cache: ${name}`);
                });
            });
        }
        
        // Check for cache headers (would need server-side analysis)
        console.log('Cache headers analysis requires server-side inspection');
    }
    
    // 6. Optimization Recommendations
    function generateRecommendations(bundleAnalysis) {
        console.log('\n💡 Optimization Recommendations:');
        
        const recommendations = [];
        
        if (bundleAnalysis.totalSize > 50 * 1024) { // > 50KB
            recommendations.push('Consider code splitting for large bundles');
        }
        
        if (bundleAnalysis.cssSize > 10 * 1024) { // > 10KB
            recommendations.push('Consider extracting CSS to external files');
        }
        
        if (bundleAnalysis.jsSize > 20 * 1024) { // > 20KB
            recommendations.push('Consider minifying and compressing JavaScript');
        }
        
        const images = document.querySelectorAll('img');
        if (images.length > 0) {
            recommendations.push('Implement lazy loading for images');
        }
        
        const externalScripts = document.querySelectorAll('script[src]');
        if (externalScripts.length > 3) {
            recommendations.push('Consider bundling external scripts');
        }
        
        if (recommendations.length === 0) {
            console.log('✅ No major optimization issues found!');
        } else {
            recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        }
    }
    
    // Run all analyses
    const bundleAnalysis = analyzeBundleSize();
    analyzePerformanceMetrics();
    analyzeResources();
    analyzeDOMComplexity();
    analyzeCaching();
    generateRecommendations(bundleAnalysis);
    
    console.log('\n✅ Performance Analysis Complete!');
    
    // Return analysis data for programmatic use
    return {
        bundleSize: bundleAnalysis,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
})();