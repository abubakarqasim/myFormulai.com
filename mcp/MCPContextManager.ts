import * as fs from 'fs';
import * as path from 'path';
import { MCPContext, TestMetadata, TestStep, UserFlow, APIContext, MCPConfig } from './MCPTypes';

/**
 * MCP Context Manager
 * Manages test context, user flows, and metadata for Model Context Protocol integration
 */
export class MCPContextManager {
  private context: MCPContext;
  private config: MCPConfig;
  private currentStepNumber: number = 0;
  private readonly contextFilePath: string;

  constructor(testMetadata: TestMetadata, config?: Partial<MCPConfig>) {
    // Default configuration
    this.config = {
      enabled: true,
      storagePath: path.resolve(process.cwd(), 'mcp', 'context'),
      captureScreenshots: true,
      captureApiCalls: true,
      capturePerformance: true,
      maxContextSize: 1000,
      ...config,
    };

    // Initialize context
    this.context = {
      metadata: testMetadata,
      steps: [],
      apiCalls: [],
      assertions: [],
      errors: [],
      screenshots: [],
      performance: {
        pageLoadTimes: {},
        apiResponseTimes: {},
        totalDuration: 0,
      },
    };

    // Ensure storage directory exists
    this.ensureStorageDirectory();

    // Generate context file path
    const sanitizedTestName = this.sanitizeFileName(testMetadata.testName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.contextFilePath = path.join(
      this.config.storagePath,
      'test-contexts',
      `${sanitizedTestName}-${timestamp}.json`
    );
  }

  /**
   * Ensure storage directories exist
   */
  private ensureStorageDirectory(): void {
    const dirs = [
      this.config.storagePath,
      path.join(this.config.storagePath, 'test-contexts'),
      path.join(this.config.storagePath, 'flow-contexts'),
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Sanitize filename for safe file system usage
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 100);
  }

  /**
   * Start a new test step
   */
  startStep(action: string, description: string, metadata?: Record<string, any>): number {
    if (!this.config.enabled) return 0;

    this.currentStepNumber++;
    const step: TestStep = {
      stepNumber: this.currentStepNumber,
      action,
      description,
      timestamp: new Date().toISOString(),
      status: 'in-progress',
      metadata,
    };

    this.context.steps.push(step);
    console.log(`📝 [MCP] Step ${this.currentStepNumber}: ${action} - ${description}`);
    return this.currentStepNumber;
  }

  /**
   * Complete a test step
   */
  completeStep(stepNumber: number, duration?: number, metadata?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const step = this.context.steps.find(s => s.stepNumber === stepNumber);
    if (step) {
      step.status = 'completed';
      step.duration = duration;
      if (metadata) {
        step.metadata = { ...step.metadata, ...metadata };
      }
    }
  }

  /**
   * Mark a step as failed
   */
  failStep(stepNumber: number, error: string, metadata?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const step = this.context.steps.find(s => s.stepNumber === stepNumber);
    if (step) {
      step.status = 'failed';
      step.error = error;
      if (metadata) {
        step.metadata = { ...step.metadata, ...metadata };
      }
    }

    this.addError(error, stepNumber);
  }

  /**
   * Add a user flow
   */
  setUserFlow(flow: UserFlow): void {
    if (!this.config.enabled) return;

    this.context.userFlow = flow;
    console.log(`🔄 [MCP] User Flow Started: ${flow.flowName} (${flow.flowId})`);
  }

  /**
   * Update user flow status
   */
  updateUserFlowStatus(status: UserFlow['status'], metadata?: Record<string, any>): void {
    if (!this.config.enabled || !this.context.userFlow) return;

    this.context.userFlow.status = status;
    if (status === 'completed' || status === 'failed') {
      this.context.userFlow.completedAt = new Date().toISOString();
    }
    if (metadata) {
      this.context.userFlow.metadata = { ...this.context.userFlow.metadata, ...metadata };
    }
  }

  /**
   * Add API call context
   */
  addAPICall(apiContext: APIContext): void {
    if (!this.config.enabled || !this.config.captureApiCalls) return;

    this.context.apiCalls.push(apiContext);
    
    // Track API response time
    if (apiContext.duration) {
      this.context.performance.apiResponseTimes[apiContext.url] = apiContext.duration;
    }
  }

  /**
   * Add assertion result
   */
  addAssertion(description: string, status: 'passed' | 'failed', error?: string): void {
    if (!this.config.enabled) return;

    this.context.assertions.push({
      description,
      status,
      timestamp: new Date().toISOString(),
      error,
    });
  }

  /**
   * Add error
   */
  addError(message: string, step?: number, stack?: string): void {
    if (!this.config.enabled) return;

    this.context.errors.push({
      message,
      stack,
      timestamp: new Date().toISOString(),
      step,
    });
  }

  /**
   * Add screenshot path
   */
  addScreenshot(screenshotPath: string): void {
    if (!this.config.enabled || !this.config.captureScreenshots) return;

    this.context.screenshots.push(screenshotPath);
  }

  /**
   * Record page load time
   */
  recordPageLoadTime(url: string, loadTime: number): void {
    if (!this.config.enabled || !this.config.capturePerformance) return;

    this.context.performance.pageLoadTimes[url] = loadTime;
  }

  /**
   * Update test metadata
   */
  updateMetadata(updates: Partial<TestMetadata>): void {
    if (!this.config.enabled) return;

    this.context.metadata = { ...this.context.metadata, ...updates };
  }

  /**
   * Get current context
   */
  getContext(): MCPContext {
    return { ...this.context };
  }

  /**
   * Save context to file
   */
  async saveContext(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      // Update final metadata
      this.context.metadata.completedAt = new Date().toISOString();
      this.context.metadata.duration = this.context.performance.totalDuration;

      // Calculate total duration
      const startTime = new Date(this.context.metadata.startedAt).getTime();
      const endTime = new Date(this.context.metadata.completedAt || Date.now()).getTime();
      this.context.performance.totalDuration = endTime - startTime;

      // Save to file
      fs.writeFileSync(
        this.contextFilePath,
        JSON.stringify(this.context, null, 2),
        'utf-8'
      );

      console.log(`💾 [MCP] Context saved: ${this.contextFilePath}`);
    } catch (error) {
      console.error(`❌ [MCP] Failed to save context:`, error);
    }
  }

  /**
   * Add custom data to context
   */
  setCustomData(key: string, value: any): void {
    if (!this.config.enabled) return;

    if (!this.context.customData) {
      this.context.customData = {};
    }
    this.context.customData[key] = value;
  }

  /**
   * Get custom data from context
   */
  getCustomData<T = any>(key: string): T | undefined {
    return this.context.customData?.[key] as T | undefined;
  }
}
