# Auth Signer Architecture Presentation - Complete Technical Guide

## PRESENTATION STRUCTURE

### Opening Statement (2 minutes)
"Today I'm presenting the Auth Signer system architecture - a digital transformation that will replace manual, email-driven ASL processes with an automated platform serving as the single source of truth for 15-16 business lines, starting with CME's 500+ monthly changes."

---

## SLIDE 1: PROJECT OVERVIEW

### The Business Problem We're Solving
**Current State Reality:**
- 500+ monthly CME requests processed manually via email chains
- Requests frequently lost between Client Managers, Product Ops, Trust Review
- Processing time: weeks to months with no visibility
- Data scattered across FileNet, Chorus, SharePoint with no central repository
- Manual callback verification varies by CM - some streamlined, others research every time
- Compliance risk from inconsistent processes and incomplete audit trails

**What We're Building:**
- Centralized Auth Signer Service (Spring Boot microservice)
- Self-service client portal (React UI in Corporate Connect)
- Automated compliance validation (WebKYC integration)
- Real-time status tracking and notifications
- Complete audit trail for regulatory requirements

**Target Impact:**
- Processing time: weeks → hours (80% improvement)
- Self-service adoption: 70% of requests without banker touch
- Error reduction: <0.1% system errors vs current manual failures
- Client satisfaction: 25% improvement through transparency

---

## SLIDE 2: TECHNICAL ARCHITECTURE OVERVIEW

### System Architecture Diagram
```
┌─────────────────────────────────────────────────┐
│                 User Layer                       │
├─────────────────┬───────────────────────────────┤
│   Internal UI   │      External UI              │
│   (Bankers)     │   (Client Portal)             │
│   React App     │   React App in CC             │
└─────────────────┴───────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              API Gateway Layer                   │
│  Authentication • Authorization • Rate Limiting  │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│           Auth Signer Service                    │
│              Spring Boot 3.x                    │
├─────────────────────────────────────────────────┤
│  ValidationEngine │ WorkflowOrchestrator        │
│  IntegrationLayer │ BusinessRuleProcessor       │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              SQL Server Database                 │
│         Single Source of Truth                   │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│            External Integrations                │
│  WebKYC │ FileNet │ OCR │ Email │ CC SSO         │
└─────────────────────────────────────────────────┘
```

### Technology Stack
**Backend:**
- Java 17+ with Spring Boot 3.x framework
- SQL Server 2019+ with clustering for high availability
- Apache Kafka for bulk processing and async workflows
- Maven build system with CI/CD pipeline

**Frontend:**
- React 18+ with TypeScript for type safety
- Material-UI following Corporate Connect design standards
- Embedded within Corporate Connect portal (federated app)
- Responsive design supporting mobile and desktop

**Infrastructure:**
- Corporate Connect SSO for authentication
- OAuth 2.0 with JWT tokens for API security
- TLS 1.3 encryption for all data in transit
- AES-256 encryption for PII at rest

---

## SLIDE 3: CORE DATA MODEL

### Database Schema Architecture
**Primary Tables:**
```sql
-- Master account table
accounts (
  account_id VARCHAR(50) PRIMARY KEY,
  business_line VARCHAR(20) NOT NULL, -- CME, ITC, GSF, GCT
  client_id VARCHAR(50) NOT NULL,
  account_type VARCHAR(50), -- deposits, investments, loans
  status VARCHAR(20) DEFAULT 'ACTIVE'
)

-- Authorized signer master records
authorized_signers (
  signer_id UNIQUEIDENTIFIER PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  title VARCHAR(100),
  privilege_level VARCHAR(50), -- SINGLE, DUAL, VIEW_ONLY
  authorization_limit DECIMAL(15,2),
  status VARCHAR(20) DEFAULT 'ACTIVE'
)

-- Account-signer relationships (many-to-many)
account_signer_associations (
  association_id UNIQUEIDENTIFIER PRIMARY KEY,
  account_id VARCHAR(50) REFERENCES accounts,
  signer_id UNIQUEIDENTIFIER REFERENCES authorized_signers,
  permissions NVARCHAR(MAX), -- JSON structure
  primary_signer_flag BIT DEFAULT 0
)
```

**Request Management:**
```sql
-- Change request tracking
asl_requests (
  request_id UNIQUEIDENTIFIER PRIMARY KEY,
  account_id VARCHAR(50) REFERENCES accounts,
  request_type VARCHAR(20), -- ADD, REMOVE, UPDATE, ATTEST
  status VARCHAR(20) DEFAULT 'DRAFT', -- PENDING, APPROVED, REJECTED
  initiated_by VARCHAR(100) NOT NULL,
  approval_required BIT DEFAULT 0
)

-- Approval workflow
asl_approvals (
  approval_id UNIQUEIDENTIFIER PRIMARY KEY,
  request_id UNIQUEIDENTIFIER REFERENCES asl_requests,
  approver_id VARCHAR(100) NOT NULL,
  approval_level INT NOT NULL, -- 1, 2, 3 for multi-stage
  status VARCHAR(20) DEFAULT 'PENDING'
)

-- Immutable audit trail
asl_audit_log (
  log_id UNIQUEIDENTIFIER PRIMARY KEY,
  account_id VARCHAR(50),
  action VARCHAR(50) NOT NULL,
  changed_by VARCHAR(100) NOT NULL,
  before_state NVARCHAR(MAX), -- JSON snapshot
  after_state NVARCHAR(MAX),  -- JSON snapshot
  change_timestamp DATETIME2 DEFAULT GETDATE()
)
```

### Key Design Principles
1. **Account-Level Management**: Different ASL per account (deposits, investments, loans)
2. **Immutable Audit Trail**: Complete history for regulatory compliance
3. **Flexible Business Rules**: Configurable without code changes
4. **Integration Ready**: Support for external system data synchronization

---

## SLIDE 4: USER WORKFLOWS

### Internal User Journey (Bankers)
**Authentication Flow:**
1. SSO login via Corporate Connect
2. Role-based entitlement validation (CM, Prod Ops, Trust Review, Risk)
3. Business line access control (CME portfolio permissions)
4. Dashboard access with pending tasks and account search

**Core Operations:**
```
Customer Search → Account Selection → Action Selection
    ↓
Add/Edit/Remove Signer → Business Rules Validation → Approval Workflow
    ↓
WebKYC Integration → System Updates → Client Notification
```

**Account-Level Management:**
- Customer can have multiple accounts (deposits, investments, loans, credits)
- Each account has separate ASL with different signers
- Cross-account scenarios: same person, different permissions
- Primary signer restrictions and minimum thresholds

### External User Journey (Clients)
**Two Paths Based on Corporate Connect Access:**

**Path 1: Existing CC Users**
- Direct login to ASL section in Corporate Connect
- Full self-service capabilities
- Real-time status tracking
- Export/print functionality with business line templates

**Path 2: Guest Users (No CC Account)**
- Banker processes paper document via OCR
- Guest token generation (24-hour expiration)
- Secure email with unique access link
- Limited review-only capabilities with banker approval required

### Workflow Decision Points
**Approval Requirements (CME Business Rules):**
- Dual approval ALWAYS required
- Client Manager + secondary approver (Risk/Trust Review)
- 48-hour approval timeout with escalation
- High-value changes (>$500K) trigger enhanced validation

---

## SLIDE 5: INTEGRATION ARCHITECTURE

### Critical System Integrations

**1. WebKYC Integration**
```yaml
Purpose: Compliance validation and sanctions screening
APIs: Get Profile, Update Profile, Recalculate Status
Flow: New signer → WebKYC validation → Approval/Denial
Data: Personal info, business details, authorization levels
Volume Concern: 500+ monthly requests - capacity validation needed
```

**2. Corporate Connect Integration**
```yaml
Purpose: SSO authentication and UI hosting
Integration Type: Federated application
Authentication: JWT tokens with role-based claims
Access Control: Entitlement-based permissions by business line
```

**3. FileNet Integration**
```yaml
Purpose: Official document storage and historical records
Document Types: ASL forms, signatures, audit reports
Storage Pattern: /BusinessLine/Year/AccountId/DocumentType/
Metadata: Account info, business line, retention period
```

**4. OCR/AI Service Integration (Cognizant Partnership)**
```yaml
Purpose: Historical document digitization (7+ years)
Processing: ML models extract structured data from scanned forms
Confidence Scoring: Field-level accuracy assessment
Fallback: Manual data entry for low-confidence results
Risk: Development not blocked - manual processes always available
```

**5. Service Request Platform Integration**
```yaml
Purpose: Banker-initiated workflow tracking
Status: CRITICAL DEPENDENCY - API specs needed
Owner: Susie's team
Mitigation: Manual workflow capability being built
```

**6. Guest User Provisioning Integration**
```yaml
Purpose: Secure temporary access for non-CC clients
Status: HIGH DEPENDENCY - security approval needed
Owner: Jessica Roswell's team
Security: 24-hour tokens, IP validation, single-use for changes
```

### Integration Data Flow Example
```json
// WebKYC Validation Request
{
  "signerId": "SIGNER_123",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "dateOfBirth": "1980-01-01"
  },
  "businessInfo": {
    "entityName": "ABC Corporation",
    "title": "CFO"
  },
  "authorizationInfo": {
    "privilegeLevel": "SINGLE_SIGNER",
    "authorizationLimit": 1000000.00
  }
}

// WebKYC Response
{
  "validationResult": "APPROVED",
  "sanctionsCheckResult": {
    "watchlistHit": false,
    "riskScore": 2
  },
  "validationTimestamp": "2025-12-01T10:30:00Z"
}
```

---

## SLIDE 6: BUSINESS LOGIC & CONFIGURATION

### Business Line Configuration Engine
**Configurable Rules (No Code Changes Required):**
```sql
-- Example CME configuration
INSERT INTO business_line_configs VALUES
('CME', 'dual_approval_required', 'true'),
('CME', 'max_authorization_limit', '1000000.00'),
('CME', 'approval_timeout_hours', '48'),
('CME', 'required_fields', '["email","phone","title","address"]'),
('CME', 'callback_verification', 'required');

-- Example IT&C configuration (different rules)
INSERT INTO business_line_configs VALUES
('ITC', 'dual_approval_required', 'false'),
('ITC', 'max_authorization_limit', '500000.00'),
('ITC', 'auto_approval_threshold', '100000.00'),
('ITC', 'streamlined_processing', 'true');
```

### CME-Specific Business Rules
**Validation Requirements:**
- Required fields: name, email, phone, title, business address
- Authorization limits: Must not exceed account maximums
- Primary signer minimum: 2 per account
- Callback verification: Mandatory for all changes

**Approval Workflow:**
- Level 1: Client Manager (always required)
- Level 2: Risk Review (for limits >$500K or high-risk accounts)
- Level 3: Trust Review (complex account structures)

**Editable vs Non-Editable Fields:**
- Editable: email, phone, title, business address
- Non-Editable: first name, last name, date of birth
- Account associations: Add/remove only, not direct edit

### Workflow State Management
```
Request Lifecycle:
DRAFT → PENDING → APPROVED/REJECTED → COMPLETED

State Transitions:
- DRAFT → PENDING: Validation passed + submission
- PENDING → APPROVED: All required approvals received  
- PENDING → REJECTED: Any approval denied
- APPROVED → COMPLETED: WebKYC validation + system updates
```

---

## SLIDE 7: SECURITY & COMPLIANCE FRAMEWORK

### Data Protection Standards
**Encryption:**
- Data at rest: AES-256 for all PII fields
- Data in transit: TLS 1.3 for all API communications
- Digital signatures: KMS/HSM integration for cryptographic signing
- Database: Transparent Data Encryption (TDE) enabled

**Access Controls:**
- Authentication: Corporate Connect SSO integration
- Authorization: Role-based access control (RBAC)
- API security: OAuth 2.0 with JWT tokens
- Rate limiting: Per-user and per-endpoint controls

### Audit Trail Requirements
**Comprehensive Logging:**
- All changes recorded with user context (who, what, when, where, how)
- Immutable audit log with cryptographic integrity
- 7+ year retention for regulatory compliance
- Real-time monitoring and anomaly detection

**Compliance Integration:**
- KYC validation through WebKYC integration
- BSA compliance with suspicious activity monitoring
- SOX requirements for change management controls
- Data privacy protection with PII encryption

### Digital Signature Framework
**Signature Requirements:**
- New signer additions: Legal authorization capture
- Annual attestations: Regulatory compliance documentation
- High-value changes: Enhanced security validation
- Bulk operations: Banker authorization confirmation

**Technical Implementation:**
- KMS/HSM integration for secure key management
- Certificate-based signature validation
- Timestamp authority for legal validity
- Non-repudiation through cryptographic proof

---

## SLIDE 8: DEVELOPMENT ROADMAP

### Epic Structure & Timeline (18 Sprints Total)
**Epic 1: Internal User Authentication & Dashboard** (Sprints 1-3)
- Size: M (3-4 sprints)
- Dependencies: Corporate Connect SSO team
- Deliverables: Banker authentication, entitlement validation, basic dashboard

**Epic 2: Internal User Signer Management** (Sprints 4-8)  
- Size: XL (5-6 sprints)
- Dependencies: WebKYC integration, business rules clarification
- Deliverables: Complete signer CRUD, approval workflows, audit access

**Epic 3: External User Onboarding** (Sprints 6-9)
- Size: L (4-5 sprints) 
- Dependencies: Guest user provisioning, OCR partnership
- Deliverables: Guest token system, OCR processing, email delivery

**Epic 4: External User Self-Service** (Sprints 10-14)
- Size: XL (5-6 sprints)
- Dependencies: Digital signature approval, template system
- Deliverables: Complete client portal, real-time tracking, export functionality

### Development Dependencies (CRITICAL)
**Must Resolve Before Development:**
1. **WebKYC API Compatibility**: Do existing APIs work for signers vs beneficial owners?
2. **Service Request Platform Integration**: API specifications from Susie's team
3. **Guest User Authentication**: Security approval and approach from Jessica's team
4. **CME Business Rules**: Exact authorization types and approval workflows

### Risk Mitigation Strategies
**Technical Risks:**
- WebKYC integration unknown: Build mock service for parallel development
- OCR dependency uncertainty: Manual fallback always available
- Service Request Platform delay: Independent workflow capability

**Development Approach:**
- Parallel development tracks to avoid blocking
- Mock services for uncertain integrations
- Manual processes maintained as fallback
- Phased integration with validation checkpoints

---

## SLIDE 9: VOLUME & PERFORMANCE REQUIREMENTS

### Current State Metrics
**CME Volume Analysis:**
- 500+ monthly requests (current processing via email)
- Processing time: weeks to months per request
- Error rate: High due to manual processes and lost emails
- Client inquiry calls: Frequent due to lack of visibility

### Target Performance Specifications
**System Performance:**
- API response time: <500ms for 95% of requests
- System availability: >99.5% uptime
- Database performance: <100ms average query time
- Concurrent users: Support for 50+ simultaneous banker sessions

**Business Metrics:**
- Processing time reduction: 80% improvement (weeks → hours)
- Self-service adoption: 70% of requests without banker intervention
- Error rate: <0.1% system errors
- Client satisfaction: 25% improvement through transparency

### Scalability Considerations
**Architecture Scaling:**
- Load-balanced Spring Boot instances with auto-scaling
- Database read replicas for performance optimization
- Kafka message queuing for bulk processing
- CDN integration for static assets and documents

**Volume Growth Planning:**
- CME: 500+ monthly expanding to other business lines
- Total platform: 15-16 business lines over 2-3 years
- Peak processing: Month-end/quarter-end volume spikes
- Bulk operations: Support for 100+ simultaneous changes

---

## SLIDE 10: SUCCESS METRICS & MONITORING

### Business Impact Measurements
**Operational Efficiency:**
- Processing time: weeks → hours transformation
- Banker productivity: 3x increase in requests handled per hour
- Self-service adoption: Target 70% client portal usage
- Error reduction: Manual process mistakes → <0.1% system errors

**Client Experience:**
- Status inquiry calls: 90% reduction through real-time tracking
- Processing transparency: 100% visibility into request status
- Self-service completion: 85% success rate without assistance
- Client satisfaction score: 25% improvement target

### Technical Performance Monitoring
**System Health Dashboards:**
```yaml
API Performance:
  - Response time percentiles (50th, 95th, 99th)
  - Throughput (requests per minute)
  - Error rates by endpoint
  - Integration health (WebKYC, FileNet, OCR)

Business Metrics:
  - Request processing times
  - Approval workflow completion rates
  - User adoption by role and business line
  - Self-service vs assisted request ratios
```

**Integration Monitoring:**
```yaml
WebKYC Integration:
  - API availability and response times
  - Validation success/failure rates
  - Queue depth during outages
  - Data consistency checks

OCR Service:
  - Document processing times
  - Confidence score distributions
  - Manual correction rates
  - Historical migration progress
```

---

## KEY QUESTIONS FOR PRODUCT MANAGER

### CRITICAL DEPENDENCIES (Must Resolve Immediately)

**1. WebKYC Integration Compatibility**
- "Can you confirm the existing WebKYC APIs work for authorized signers, not just beneficial owners?"
- "What CME profile types are supported in WebKYC?"  
- "Can WebKYC handle our 500+ monthly volume without rate limiting?"
- "When can we get test environment access and API documentation?"

**2. Service Request Platform Integration**
- "When will Susie's team provide API specifications?"
- "What's the timeline for Service Request Platform availability?"
- "Can we proceed with independent workflow if this integration is delayed?"

**3. Guest User Provisioning Decision** 
- "Has security team approved the guest user approach?"
- "OTP validation vs full Corporate Connect account - what's the final decision?"
- "When will Jessica Roswell's team provide technical specifications?"

### BUSINESS RULES CLARIFICATION

**4. CME Authorization Types**
- "What are the exact authorization categories mentioned in transcripts (callback grey area, need categories, compliance 3rd party)?"
- "What dollar thresholds trigger dual approval vs single approval?"
- "How many primary signers are required minimum per account?"

**5. Approval Workflow Details**
- "Who exactly can serve as secondary approvers beyond Client Managers?"
- "What's the escalation process if approvers don't respond within 48 hours?"
- "Are there emergency override procedures for critical business needs?"

### TECHNICAL IMPLEMENTATION

**6. Digital Signature Requirements**
- "Has Risk team approved digital signatures replacing wet signatures?"
- "What signature scenarios require KMS vs HSM integration?"
- "When will we get final security requirements?"

**7. OCR Partnership Scope**
- "What's the confidence threshold for automated vs manual processing?"
- "How many historical documents need digitization for CME?"
- "What's the fallback plan if Cognizant partnership doesn't deliver?"

### ROLLOUT STRATEGY

**8. MVP Scope Definition**
- "Which CME clients should be included in pilot rollout?"
- "What functionality is absolutely required vs nice-to-have for MVP?"
- "How long should we run parallel processes (manual + digital)?"

**9. Success Criteria**
- "What specific metrics define successful CME MVP launch?"
- "What client satisfaction improvements are expected?"
- "How will we measure banker productivity gains?"

### BUSINESS LINE EXPANSION

**10. Future Roadmap**
- "What's the confirmed timeline for IT&C, GSF, GCT integration?"
- "How do business rules differ between these lines?"
- "What additional integrations will be required for other business lines?"

---

## PRESENTATION CLOSING

### Next Steps & Action Items
**Immediate Actions Required:**
1. **Critical Dependency Resolution**: WebKYC, Service Request Platform, Guest User specs
2. **Business Rules Documentation**: Exact CME workflows and approval requirements  
3. **Technical Specification Completion**: API contracts and security requirements
4. **Development Kickoff**: Begin foundational work while dependencies resolve

### Value Proposition Recap
"This Auth Signer platform transforms a broken, manual process affecting 500+ monthly CME changes into an automated, compliant, and scalable solution. By establishing the single source of truth with real-time visibility, we're not just fixing current problems - we're building the foundation for enterprise-wide ASL management across all business lines."

**ROI Impact:**
- Weeks → hours processing time (80% improvement)
- 70% self-service adoption reducing banker workload
- Enhanced compliance and audit capabilities
- Scalable platform for 15-16 business line expansion
- Improved client experience with real-time transparency

### Questions & Discussion
"I've outlined our comprehensive technical approach. The architecture is solid, the technology choices are proven, and the business value is clear. Our success depends on resolving the critical dependencies I've identified. What questions do you have, and how can we accelerate the dependency resolution to keep our Q4 2025 CME MVP timeline on track?"