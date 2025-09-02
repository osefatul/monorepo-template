```json
graph TD
    %% CLIENT WITH CC ACCOUNT WORKFLOW
    subgraph "WORKFLOW 1: Client with Corporate Connect Account"
        A1[Client logs into CC Portal] --> B1[Load ASL Dashboard]
        B1 --> C1{What action?}
        C1 --> D1[Add Signer]
        C1 --> D2[Remove Signer]
        C1 --> D3[Update Signer]
        C1 --> D4[Attest List]

        D1 --> E1["Fill Add Form<br/>DB: Insert asl_requests<br/>Status: DRAFT"]
        D2 --> E2["Select Signer<br/>DB: Insert asl_requests<br/>Action: REMOVE"]
        D3 --> E3["Update Details<br/>DB: Insert asl_requests<br/>Action: UPDATE"]
        D4 --> E4["Digital Attestation<br/>DB: Insert asl_requests<br/>Type: ATTEST"]

        E1 --> F1["Business Rules Validation<br/>Service: ValidationEngine<br/>Check: Privilege limits, dual approval"]
        E2 --> F1
        E3 --> F1
        E4 --> F1

        F1 --> G1{"Approval Required?<br/>DB: Check business_line_configs<br/>Rule: dual_approval_required"}

        G1 -->|No| H1["Auto-Approve<br/>Status: APPROVED<br/>Call WebKYC API"]
        G1 -->|Yes| H2["Create Approval Task<br/>DB: Insert asl_approvals<br/>Status: PENDING"]

        H2 --> I1["Notify Approver<br/>Service: NotificationService<br/>Email/Dashboard alert"]
        I1 --> J1["Approver Reviews<br/>UI: Internal Dashboard<br/>DB: Update asl_approvals"]

        J1 --> K1{Approved?}
        K1 -->|Yes| H1
        K1 -->|No| L1["Reject & Notify<br/>Status: REJECTED<br/>Email client"]

        H1 --> M1["Update WebKYC<br/>API: POST /webkyc/signers<br/>Payload: signer details"]
        M1 --> N1["Update FileNet<br/>API: POST /filenet/documents<br/>Store final ASL"]
        N1 --> O1["Complete Request<br/>DB: Update status=COMPLETED<br/>Insert audit_log"]
        O1 --> P1["Notify Client<br/>Email + Dashboard update"]
    end

    %% CLIENT WITHOUT CC ACCOUNT (GUEST) WORKFLOW
    subgraph "WORKFLOW 2: Client without CC Account (Guest Access)"
        A2["Banker receives paper doc"] --> B2["Login Internal UI<br/>Auth: SSO Authentication"]
        B2 --> C2["Upload Document<br/>UI: DocumentUpload component"]
        C2 --> D5["OCR Processing<br/>API: POST /ocr/process<br/>Service: OCR Service"]

        D5 --> E5["OCR Extracts Data<br/>Response: JSON with confidence scores<br/>DB: Insert asl_documents"]
        E5 --> F2["Banker Reviews Data<br/>UI: OCRReview component<br/>Validates extracted fields"]

        F2 --> G2{Data Accurate?}
        G2 -->|No| H3["Manual Corrections<br/>UI: Edit extracted data<br/>Update confidence scores"]
        G2 -->|Yes| I2["Generate Guest Token<br/>Service: GuestUserProvisioning"]
        H3 --> I2

        I2 --> J2["Create Guest Access<br/>DB: Insert guest_tokens<br/>Expires: 24 hours"]
        J2 --> K2["Email Client Link<br/>Service: EmailService<br/>Secure URL with token"]

        K2 --> L2["Client Clicks Link<br/>Validates token<br/>DB: Check guest_tokens.expires_at"]
        L2 --> M2{Valid Token?}

        M2 -->|No| N2["Access Denied<br/>Show error message"]
        M2 -->|Yes| O2["Load Guest Dashboard<br/>UI: GuestDashboard component<br/>Show extracted ASL data"]

        O2 --> P2["Client Reviews Data<br/>Can edit/add/remove signers<br/>DB: Update asl_request_details"]
        P2 --> Q2["Client Submits<br/>Status: PENDING_APPROVAL<br/>Mark token as used"]

        Q2 --> R2["Banker Validation<br/>UI: Internal dashboard<br/>Review client changes"]
        R2 --> S2{Banker Approves?}
        S2 -->|Yes| T2[Continue to WebKYC Update]
        S2 -->|No| U2["Return to Client<br/>Status: REQUIRES_CHANGES"]

        T2 --> M1
        U2 --> P2
    end

    %% BULK UPLOAD WORKFLOW
    subgraph "WORKFLOW 3: Bulk Upload Process"
        A3["Banker receives bulk request<br/>Excel/CSV file"] --> B3["Login Internal UI<br/>Navigate to Bulk Upload"]
        B3 --> C3["Upload File<br/>UI: BulkUpload component<br/>Validate file format"]

        C3 --> D6["File Validation<br/>Service: BulkProcessingService<br/>Check columns, data types"]
        D6 --> E6{Valid Format?}

        E6 -->|No| F3["Show Validation Errors<br/>UI: Display specific errors<br/>Allow file re-upload"]
        E6 -->|Yes| G3["Queue Processing<br/>Service: Kafka Producer<br/>Topic: bulk-asl-processing"]

        G3 --> H4["Background Processing<br/>Consumer: BulkProcessingConsumer<br/>Process each row"]
        H4 --> I3["Create Individual Requests<br/>DB: Bulk insert asl_requests<br/>Status: BULK_PROCESSING"]

        I3 --> J3["Apply Business Rules<br/>Service: ValidationEngine<br/>Validate each request"]
        J3 --> K3["Generate Approval Tasks<br/>DB: Insert asl_approvals<br/>Group by approval level"]

        K3 --> L3["Batch Approval Process<br/>UI: Approval dashboard<br/>Show grouped requests"]
        L3 --> M3["Mass Approve/Reject<br/>DB: Update asl_approvals<br/>Batch operation"]

        M3 --> N3["Update All Systems<br/>API: Batch calls to WebKYC<br/>Parallel processing"]
        N3 --> O3["Generate Report<br/>Service: ReportingService<br/>Success/failure summary"]
        O3 --> P3["Notify Stakeholders<br/>Email with processing results"]
    end

    %% ONBOARDING INTEGRATION WORKFLOW
    subgraph "WORKFLOW 4: New Client Onboarding Integration"
        A4["New Client Onboarding Starts<br/>System: Onboarding Service"] --> B4["Collect ASL Data<br/>UI: Onboarding forms<br/>Capture signer information"]

        B4 --> C4["Onboarding Completes<br/>All KYC checks passed<br/>Account created"]
        C4 --> D7["Push to Auth Signer Service<br/>API: POST /api/v1/onboarding/import<br/>Payload: Complete ASL data"]

        D7 --> E7["Validate Imported Data<br/>Service: ValidationEngine<br/>Business rules check"]
        E7 --> F4["Create Initial ASL Record<br/>DB: Insert authorized_signers<br/>Status: ACTIVE"]

        F4 --> G4["Create Audit Trail<br/>DB: Insert asl_audit_log<br/>Source: ONBOARDING"]
        G4 --> H5["Sync to WebKYC<br/>API: POST /webkyc/signers<br/>Initial privilege setup"]

        H5 --> I4["Store in FileNet<br/>API: POST /filenet/documents<br/>Official ASL document"]
        I4 --> J4["Send Welcome Email<br/>Service: EmailService<br/>CC account details"]
    end

    %% SYSTEM-TO-SYSTEM INTEGRATION
    subgraph "WORKFLOW 5: Downstream System Verification"
        A5["External System Needs Verification<br/>System: SWP/STA/Transaction System"] --> B5["API Call to Auth Signer<br/>GET /api/v1/accounts/{id}/signers<br/>Headers: API Key"]

        B5 --> C5["Validate API Credentials<br/>Service: SecurityService<br/>Check rate limits"]
        C5 --> D8{Valid Request?}

        D8 -->|No| E8["Return 401/403<br/>Log security event"]
        D8 -->|Yes| F5["Query Database<br/>SELECT from authorized_signers<br/>WHERE status=ACTIVE"]

        F5 --> G5["Apply Data Filters<br/>Service: DataFilterService<br/>Remove sensitive fields"]
        G5 --> H6["Return ASL Data<br/>JSON response<br/>Current active signers only"]

        H6 --> I5["Log API Usage<br/>DB: Insert api_usage_log<br/>Track consumption"]
    end

    %% ERROR HANDLING & RECOVERY
    subgraph "WORKFLOW 6: Error Handling & Recovery"
        A6["System Error Detected<br/>Service: ErrorHandlingService"] --> B6{Error Type?}

        B6 --> C6["WebKYC API Failure<br/>HTTP 500/timeout"]
        B6 --> C7["FileNet API Failure<br/>Document storage error"]
        B6 --> C8["Database Error<br/>Connection/constraint violation"]
        B6 --> C9["OCR Service Failure<br/>Processing timeout"]

        C6 --> D9["Retry with Backoff<br/>Service: RetryService<br/>Max 3 attempts"]
        C7 --> D10["Queue for Later<br/>Service: DocumentQueueService<br/>Retry in 1 hour"]
        C8 --> D11["Rollback Transaction<br/>DB: ROLLBACK<br/>Preserve data integrity"]
        C9 --> D12["Manual Processing Flag<br/>DB: Update ocr_processed=false<br/>Route to banker"]

        D9 --> E9{Retry Successful?}
        D10 --> F6["Background Job Retry<br/>Scheduled task<br/>Process queued documents"]
        D11 --> G6["Notify Support Team<br/>Alert: Database error<br/>Requires investigation"]
        D12 --> H7["Create Manual Task<br/>UI: Show in banker queue<br/>Requires human review"]

        E9 -->|Yes| I6[Continue Normal Flow]
        E9 -->|No| J5["Escalate to Support<br/>Create incident ticket<br/>Manual intervention needed"]
    end

    %% DATABASE SCHEMA RELATIONSHIPS
    subgraph "DATABASE SCHEMA & DATA FLOW"
        DB1["accounts table<br/>PK: account_id<br/>Fields: business_line, client_id, status"]
        DB2["authorized_signers table<br/>PK: signer_id<br/>FK: account_id<br/>Fields: name, email, privilege_level"]
        DB3["asl_requests table<br/>PK: request_id<br/>FK: account_id<br/>Fields: type, status, initiated_by"]
        DB4["asl_request_details table<br/>PK: detail_id<br/>FK: request_id, signer_id<br/>Fields: action, before_data, after_data"]
        DB5["asl_approvals table<br/>PK: approval_id<br/>FK: request_id<br/>Fields: approver_id, status, level"]
        DB6["asl_audit_log table<br/>PK: log_id<br/>Fields: action, changed_by, before_state, after_state"]
        DB7["guest_tokens table<br/>PK: token_id<br/>Fields: account_id, email, token_hash, expires_at"]
        DB8["asl_documents table<br/>PK: document_id<br/>FK: request_id<br/>Fields: file_path, ocr_processed, confidence"]

        DB1 --> DB2
        DB1 --> DB3
        DB3 --> DB4
        DB3 --> DB5
        DB1 --> DB6
        DB1 --> DB7
        DB3 --> DB8
    end

    %% API ENDPOINTS & SERVICES
    subgraph "API ENDPOINTS & SERVICES MAPPING"
        API1["External UI APIs<br/>GET /accounts/{id}/signers<br/>POST /accounts/{id}/signers<br/>PUT /requests/{id}/status"]
        API2["Internal UI APIs<br/>POST /ocr/process<br/>GET /requests/pending<br/>POST /bulk/upload"]
        API3["Integration APIs<br/>POST /onboarding/import<br/>GET /system/health<br/>POST /guest/provision"]

        SVC1["AuthSignerService<br/>Business logic<br/>Validation rules<br/>Workflow orchestration"]
        SVC2["ValidationEngine<br/>Business rule processor<br/>Approval workflow logic<br/>Compliance checks"]
        SVC3["IntegrationService<br/>WebKYC client<br/>FileNet client<br/>OCR client<br/>Email service"]
        SVC4["SecurityService<br/>Authentication<br/>Authorization<br/>Token management<br/>Rate limiting"]

        API1 --> SVC1
        API2 --> SVC1
        API3 --> SVC1
        SVC1 --> SVC2
        SVC1 --> SVC3
        SVC1 --> SVC4
    end
```
