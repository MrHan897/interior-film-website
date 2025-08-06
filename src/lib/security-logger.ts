interface SecurityEvent {
  type: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'SUSPICIOUS_ACTIVITY' | 'VALIDATION_ERROR' | 'RATE_LIMIT_HIT'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ip: string
  userAgent?: string
  endpoint: string
  userId?: string
  username?: string
  details: Record<string, unknown>
  timestamp: Date
}

class SecurityLogger {
  private static instance: SecurityLogger
  
  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger()
    }
    return SecurityLogger.instance
  }

  private formatLogMessage(event: SecurityEvent): string {
    const { type, severity, ip, endpoint, username, details, timestamp } = event
    
    return JSON.stringify({
      timestamp: timestamp.toISOString(),
      type,
      severity,
      ip,
      endpoint,
      username: username || 'anonymous',
      details: this.sanitizeDetails(details),
      source: 'security-logger'
    })
  }

  private sanitizeDetails(details: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...details }
    
    // 민감한 정보 마스킹
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization']
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '***REDACTED***'
      }
    })
    
    return sanitized
  }

  private writeLog(level: string, message: string): void {
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : console.info
    
    logMethod(`[SECURITY] ${message}`)
    
    // 프로덕션 환경에서는 외부 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(level, message)
    }
  }

  private async sendToExternalLogger(_level: string, _message: string): Promise<void> {
    // 외부 로깅 서비스 (예: Datadog, CloudWatch, ELK Stack 등)에 전송
    // 현재는 구현되지 않음
    try {
      // await externalLogger.send({ level, message })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  logAuthSuccess(ip: string, username: string, endpoint: string, userAgent?: string): void {
    const event: SecurityEvent = {
      type: 'AUTH_SUCCESS',
      severity: 'LOW',
      ip,
      userAgent,
      endpoint,
      username,
      details: { action: 'login_success' },
      timestamp: new Date()
    }
    
    this.writeLog('info', this.formatLogMessage(event))
  }

  logAuthFailure(ip: string, username: string, endpoint: string, reason: string, userAgent?: string): void {
    const event: SecurityEvent = {
      type: 'AUTH_FAILURE',
      severity: 'MEDIUM',
      ip,
      userAgent,
      endpoint,
      username,
      details: { action: 'login_failed', reason },
      timestamp: new Date()
    }
    
    this.writeLog('warn', this.formatLogMessage(event))
  }

  logSuspiciousActivity(ip: string, endpoint: string, activity: string, details: Record<string, unknown> = {}, userAgent?: string): void {
    const event: SecurityEvent = {
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      ip,
      userAgent,
      endpoint,
      details: { activity, ...details },
      timestamp: new Date()
    }
    
    this.writeLog('warn', this.formatLogMessage(event))
  }

  logValidationError(ip: string, endpoint: string, field: string, value: string, userAgent?: string): void {
    const event: SecurityEvent = {
      type: 'VALIDATION_ERROR',
      severity: 'MEDIUM',
      ip,
      userAgent,
      endpoint,
      details: { 
        field, 
        value: value.length > 100 ? value.substring(0, 100) + '...' : value,
        action: 'validation_failed'
      },
      timestamp: new Date()
    }
    
    this.writeLog('warn', this.formatLogMessage(event))
  }

  logRateLimitHit(ip: string, endpoint: string, limit: number, userAgent?: string): void {
    const event: SecurityEvent = {
      type: 'RATE_LIMIT_HIT',
      severity: 'HIGH',
      ip,
      userAgent,
      endpoint,
      details: { 
        action: 'rate_limit_exceeded',
        limit,
        timestamp_window: '1_minute'
      },
      timestamp: new Date()
    }
    
    this.writeLog('warn', this.formatLogMessage(event))
  }

  logCriticalSecurityEvent(ip: string, endpoint: string, event: string, details: Record<string, unknown> = {}, userAgent?: string): void {
    const securityEvent: SecurityEvent = {
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'CRITICAL',
      ip,
      userAgent,
      endpoint,
      details: { critical_event: event, ...details },
      timestamp: new Date()
    }
    
    this.writeLog('error', this.formatLogMessage(securityEvent))
    
    // 중요한 보안 이벤트는 즉시 알림
    this.sendImmediateAlert(securityEvent)
  }

  private async sendImmediateAlert(event: SecurityEvent): Promise<void> {
    // 즉시 알림 (예: Slack, 이메일, SMS 등)
    try {
      console.error('🚨 CRITICAL SECURITY ALERT:', this.formatLogMessage(event))
      // await alertService.sendCriticalAlert(event)
    } catch (error) {
      console.error('Failed to send critical security alert:', error)
    }
  }
}

export const securityLogger = SecurityLogger.getInstance()

// 편의 함수들
export const logAuthSuccess = (ip: string, username: string, endpoint: string, userAgent?: string) => 
  securityLogger.logAuthSuccess(ip, username, endpoint, userAgent)

export const logAuthFailure = (ip: string, username: string, endpoint: string, reason: string, userAgent?: string) => 
  securityLogger.logAuthFailure(ip, username, endpoint, reason, userAgent)

export const logSuspiciousActivity = (ip: string, endpoint: string, activity: string, details?: Record<string, unknown>, userAgent?: string) => 
  securityLogger.logSuspiciousActivity(ip, endpoint, activity, details, userAgent)

export const logValidationError = (ip: string, endpoint: string, field: string, value: string, userAgent?: string) => 
  securityLogger.logValidationError(ip, endpoint, field, value, userAgent)

export const logRateLimitHit = (ip: string, endpoint: string, limit: number, userAgent?: string) => 
  securityLogger.logRateLimitHit(ip, endpoint, limit, userAgent)

export const logCriticalSecurityEvent = (ip: string, endpoint: string, event: string, details?: Record<string, unknown>, userAgent?: string) => 
  securityLogger.logCriticalSecurityEvent(ip, endpoint, event, details, userAgent)