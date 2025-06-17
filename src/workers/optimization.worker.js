/**
 * =============================================================================
 * OPTIMIZATION WORKER - Background Processing
 * =============================================================================
 *
 * This Web Worker handles heavy computations in the background to keep
 * the main thread responsive. Used for code analysis, optimization checks,
 * and performance monitoring.
 *
 * 🎯 Features:
 * - Code complexity analysis
 * - Bundle size calculations
 * - Performance metrics processing
 * - Accessibility audit processing
 *
 * 📚 Learn More:
 * - Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 * - Performance: /docs/tutorials/performance-optimization.md
 * =============================================================================
 */

// Message handler
self.addEventListener('message', async event => {
  const { type, data } = event.data;

  try {
    let result;

    switch (type) {
      case 'ANALYZE_CODE':
        result = await analyzeCode(data);
        break;

      case 'CALCULATE_METRICS':
        result = await calculateMetrics(data);
        break;

      case 'OPTIMIZE_IMAGES':
        result = await optimizeImages(data);
        break;

      case 'PROCESS_BUNDLE':
        result = await processBundleStats(data);
        break;

      default:
        throw new Error(`Unknown worker task: ${type}`);
    }

    // Send result back to main thread
    self.postMessage({
      type: 'SUCCESS',
      taskType: type,
      result
    });

  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'ERROR',
      taskType: type,
      error: error.message
    });
  }
});

/**
 * Analyze code complexity and quality
 * @param {Object} data - Code analysis data
 * @returns {Object} Analysis results
 */
async function analyzeCode(data) {
  const { code, language } = data;
  const metrics = {
    lines: 0,
    statements: 0,
    functions: 0,
    complexity: 0,
    maintainability: 100
  };

  // Count lines
  metrics.lines = code.split('\n').length;

  // Language-specific analysis
  if (language === 'javascript') {
    // Count functions
    metrics.functions = (code.match(/function\s+\w+|=>\s*{|=>\s*\(/g) || []).length;

    // Count statements (simplified)
    metrics.statements = (code.match(/;/g) || []).length;

    // Calculate cyclomatic complexity (simplified)
    const conditions = (code.match(
      /if\s*\(|else\s*{|else\s+if|switch\s*\(|case\s+|while\s*\(|for\s*\(/g
    ) || []).length;
    metrics.complexity = conditions + 1;

    // Calculate maintainability index (simplified)
    const volume = metrics.lines * Math.log2(metrics.statements + 1);
    // const difficulty = metrics.complexity * (metrics.functions + 1);
    metrics.maintainability = Math.max(0, Math.min(100,
      171 - 5.2 * Math.log(volume) - 0.23 * metrics.complexity - 16.2 * Math.log(metrics.lines)
    ));
  }

  return {
    metrics,
    suggestions: generateSuggestions(metrics)
  };
}

/**
 * Generate code improvement suggestions
 * @param {Object} metrics - Code metrics
 * @returns {Array} Suggestions
 */
function generateSuggestions(metrics) {
  const suggestions = [];

  if (metrics.complexity > 10) {
    suggestions.push({
      type: 'complexity',
      message: 'Consider breaking down complex functions',
      severity: 'warning'
    });
  }

  if (metrics.lines > 300) {
    suggestions.push({
      type: 'size',
      message: 'File is getting large, consider splitting into modules',
      severity: 'info'
    });
  }

  if (metrics.maintainability < 70) {
    suggestions.push({
      type: 'maintainability',
      message: 'Code maintainability could be improved',
      severity: 'warning'
    });
  }

  return suggestions;
}

/**
 * Calculate performance metrics
 * @param {Object} data - Performance data
 * @returns {Object} Calculated metrics
 */
async function calculateMetrics(data) {
  const { resources, timing } = data;

  // Calculate resource metrics
  const resourceMetrics = {
    totalSize: 0,
    byType: {},
    slowResources: []
  };

  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    resourceMetrics.totalSize += size;

    const type = resource.initiatorType || 'other';
    if (!resourceMetrics.byType[type]) {
      resourceMetrics.byType[type] = { count: 0, size: 0 };
    }
    resourceMetrics.byType[type].count++;
    resourceMetrics.byType[type].size += size;

    // Flag slow resources
    if (resource.duration > 1000) {
      resourceMetrics.slowResources.push({
        name: resource.name,
        duration: resource.duration,
        size: size
      });
    }
  });

  // Calculate timing metrics
  const timingMetrics = {
    domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
    domComplete: timing.domComplete - timing.domLoading,
    loadComplete: timing.loadEventEnd - timing.loadEventStart,
    firstByte: timing.responseStart - timing.requestStart,
    totalTime: timing.loadEventEnd - timing.navigationStart
  };

  // Calculate scores
  const scores = {
    performance: calculatePerformanceScore(timingMetrics, resourceMetrics),
    resourceEfficiency: calculateResourceScore(resourceMetrics),
    loadTime: calculateLoadTimeScore(timingMetrics.totalTime)
  };

  return {
    resources: resourceMetrics,
    timing: timingMetrics,
    scores,
    recommendations: generateRecommendations(resourceMetrics, timingMetrics)
  };
}

/**
 * Calculate performance score
 * @param {Object} timing - Timing metrics
 * @param {Object} resources - Resource metrics
 * @returns {number} Performance score (0-100)
 */
function calculatePerformanceScore(timing, resources) {
  let score = 100;

  // Deduct points for slow metrics
  if (timing.totalTime > 3000) {score -= 20;}
  if (timing.domContentLoaded > 1500) {score -= 15;}
  if (resources.totalSize > 1048576) {score -= 15;} // > 1MB
  if (resources.slowResources.length > 3) {score -= 10;}

  return Math.max(0, score);
}

/**
 * Calculate resource efficiency score
 * @param {Object} resources - Resource metrics
 * @returns {number} Resource score (0-100)
 */
function calculateResourceScore(resources) {
  let score = 100;

  // Check resource distribution
  const jsSize = resources.byType.script?.size || 0;
  const cssSize = resources.byType.css?.size || 0;
  const imgSize = resources.byType.img?.size || 0;

  // Penalize large resources
  if (jsSize > 500000) {score -= 20;} // > 500KB JS
  if (cssSize > 200000) {score -= 15;} // > 200KB CSS
  if (imgSize > 2097152) {score -= 20;} // > 2MB images

  return Math.max(0, score);
}

/**
 * Calculate load time score
 * @param {number} totalTime - Total load time in ms
 * @returns {number} Load time score (0-100)
 */
function calculateLoadTimeScore(totalTime) {
  // Based on industry standards
  if (totalTime < 1000) {return 100;} // < 1s: Excellent
  if (totalTime < 2000) {return 90;}  // < 2s: Good
  if (totalTime < 3000) {return 70;}  // < 3s: Average
  if (totalTime < 5000) {return 50;}  // < 5s: Poor
  return 30; // > 5s: Very poor
}

/**
 * Generate performance recommendations
 * @param {Object} resources - Resource metrics
 * @param {Object} timing - Timing metrics
 * @returns {Array} Recommendations
 */
function generateRecommendations(resources, timing) {
  const recommendations = [];

  // Resource recommendations
  if (resources.totalSize > 2097152) {
    recommendations.push({
      category: 'resources',
      priority: 'high',
      message: 'Total resource size exceeds 2MB. Consider optimizing images and code splitting.'
    });
  }

  if (resources.slowResources.length > 0) {
    recommendations.push({
      category: 'performance',
      priority: 'medium',
      message: `${resources.slowResources.length} resources took over 1 second to load. Consider lazy loading or optimization.`
    });
  }

  // Timing recommendations
  if (timing.domContentLoaded > 2000) {
    recommendations.push({
      category: 'performance',
      priority: 'high',
      message: 'DOM content loaded slowly. Review critical rendering path.'
    });
  }

  if (timing.firstByte > 600) {
    recommendations.push({
      category: 'server',
      priority: 'medium',
      message: 'Slow server response time. Consider server optimization or CDN.'
    });
  }

  return recommendations;
}

/**
 * Process bundle statistics
 * @param {Object} data - Bundle stats data
 * @returns {Object} Processed stats
 */
async function processBundleStats(data) {
  const { modules, chunks, assets } = data;

  // Analyze modules
  const moduleAnalysis = {
    total: modules.length,
    bySize: modules.sort((a, b) => b.size - a.size).slice(0, 10),
    duplicates: findDuplicates(modules),
    unused: findUnusedExports(modules)
  };

  // Analyze chunks
  const chunkAnalysis = {
    total: chunks.length,
    sizes: chunks.map(c => ({ name: c.name, size: c.size })),
    optimization: analyzeChunkOptimization(chunks)
  };

  // Analyze assets
  const assetAnalysis = {
    total: assets.length,
    byType: groupAssetsByType(assets),
    largeAssets: assets.filter(a => a.size > 100000)
  };

  return {
    modules: moduleAnalysis,
    chunks: chunkAnalysis,
    assets: assetAnalysis,
    recommendations: generateBundleRecommendations(moduleAnalysis, chunkAnalysis, assetAnalysis)
  };
}

/**
 * Find duplicate modules
 * @param {Array} modules - Module list
 * @returns {Array} Duplicate modules
 */
function findDuplicates(modules) {
  const seen = new Map();
  const duplicates = [];

  modules.forEach(module => {
    const key = module.name || module.identifier;
    if (seen.has(key)) {
      duplicates.push({
        name: key,
        instances: seen.get(key) + 1
      });
      seen.set(key, seen.get(key) + 1);
    } else {
      seen.set(key, 1);
    }
  });

  return duplicates;
}

/**
 * Find unused exports
 * @param {Array} modules - Module list
 * @returns {Array} Unused exports
 */
function findUnusedExports(modules) {
  // Simplified analysis - in real implementation would use AST
  return modules
    .filter(m => m.usedExports && m.providedExports)
    .filter(m => m.usedExports.length < m.providedExports.length)
    .map(m => ({
      module: m.name,
      unused: m.providedExports.filter(e => !m.usedExports.includes(e))
    }));
}

/**
 * Analyze chunk optimization potential
 * @param {Array} chunks - Chunk list
 * @returns {Object} Optimization analysis
 */
function analyzeChunkOptimization(chunks) {
  const analysis = {
    canMerge: [],
    canSplit: [],
    optimal: []
  };

  chunks.forEach(chunk => {
    if (chunk.size < 10000) {
      analysis.canMerge.push(chunk.name);
    } else if (chunk.size > 244000) {
      analysis.canSplit.push(chunk.name);
    } else {
      analysis.optimal.push(chunk.name);
    }
  });

  return analysis;
}

/**
 * Group assets by type
 * @param {Array} assets - Asset list
 * @returns {Object} Grouped assets
 */
function groupAssetsByType(assets) {
  return assets.reduce((groups, asset) => {
    const ext = asset.name.split('.').pop();
    if (!groups[ext]) {
      groups[ext] = { count: 0, totalSize: 0 };
    }
    groups[ext].count++;
    groups[ext].totalSize += asset.size;
    return groups;
  }, {});
}

/**
 * Optimize images (placeholder implementation)
 * @param {Object} _data - Image data
 * @returns {Object} Optimization results
 */
async function optimizeImages(_data) {
  // Placeholder implementation
  return {
    optimized: true,
    savedBytes: 0,
    message: 'Image optimization not implemented in worker'
  };
}

/**
 * Generate bundle optimization recommendations
 * @param {Object} modules - Module analysis
 * @param {Object} chunks - Chunk analysis
 * @param {Object} assets - Asset analysis
 * @returns {Array} Recommendations
 */
function generateBundleRecommendations(modules, chunks, assets) {
  const recommendations = [];

  if (modules.duplicates.length > 0) {
    recommendations.push({
      type: 'duplicates',
      priority: 'high',
      message: `Found ${modules.duplicates.length} duplicate modules. Consider deduplication.`
    });
  }

  if (chunks.optimization.canMerge.length > 3) {
    recommendations.push({
      type: 'chunks',
      priority: 'medium',
      message: 'Several small chunks detected. Consider merging for fewer requests.'
    });
  }

  if (assets.largeAssets.length > 0) {
    recommendations.push({
      type: 'assets',
      priority: 'high',
      message: `${assets.largeAssets.length} assets exceed 100KB. Consider optimization.`
    });
  }

  return recommendations;
}

// Worker is ready
self.postMessage({ type: 'READY' });