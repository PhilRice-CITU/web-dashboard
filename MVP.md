# PhilRice Unified Dashboard MVP (Current-System Aligned)

## 1) MVP Goal

Deliver a working thesis/pilot platform where Raspberry Pi edge controllers capture rice images, send metadata to the cloud stack, run YOLOv8-assisted grading workflows, and present actionable operations + analytics in one dashboard.

The MVP must prove these outcomes:

- Fleet visibility: know which devices are online, healthy, and ready.
- Remote operation: trigger and monitor scans without SSH/manual intervention.
- Result traceability: link each scan to images, defects, and final grade.
- Decision support: surface trends aligned with PNS/BAFS 290:2019 reporting needs.

## 2) Current System Context

This MVP is based on the active repo layout:

- `web-dashboard`: operator/admin UI (React + map + analytics views).
- `api-server`: command, ingestion, and data API.
- `edge-client`: Raspberry Pi runtime (capture, queue, heartbeat, upload routing).
- `ai-vision-model`: model assets and inference-related artifacts.
- `docs-and-architecture`: architecture and operating guides.

## 3) MVP Scope (Must Have)

### A. Fleet & Device Management (IoT Core)

1. Device registry

- Unique device ID (e.g., `NE-01`, `IS-03`), station name, deployment type.
- Network identity (IP/MAC where available), last heartbeat timestamp.

2. Live health telemetry

- State: `online`, `scanning`, `inactive`, `error`.
- Vitals from edge client: CPU load/temp, memory, storage, queue depth.

3. Peripheral readiness

- Camera detected/not detected.
- LED circuit status (IR/Blue) when available.
- Quick readiness chip: `Ready` / `Needs Attention`.

4. Device events/log stream

- Structured events (`camera_timeout`, `upload_retry`, `analysis_started`).
- Time-filtered logs for remote troubleshooting.

### B. Remote Operations (Tier 1 Execution)

1. Start analysis remotely

- Select online device.
- Input sample ID / batch number / operator note.
- Trigger analysis and receive immediate command acknowledgement.

2. Pre-flight validation

- Snapshot or low-fps feed before analysis start.
- Checklist: camera visible, grain spread acceptable, lighting available.

3. Remote maintenance controls (MVP-lite)

- Reconnect camera command.
- Restart capture service command.
- Optional LED test toggles (if stable on hardware side).

### C. Quality Analytics & Reporting

1. Recent analyses feed

- Timestamp, sample ID, device, status, grade result.

2. Detailed inspection view

- RGB/NIR image references.
- Annotated output with YOLO detections.
- Grain composition summary: sound, broken, chalky, discolored, foreign matter.

3. KPI dashboard

- Samples processed today/week.
- Grade distribution.
- Average moisture and broken-grain rates.
- Defect trend by station/device.

## 4) Non-Functional MVP Requirements

- Reliability: queued uploads on edge when cloud is unavailable.
- Auditability: each result tied to `sample_id`, `device_id`, and timestamps.
- Usability: operators can execute scan flow in under 5 clicks after device selection.
- Performance: dashboard updates heartbeat/stream views in near real-time.
- Security baseline: authenticated dashboard access and protected trigger endpoints.

## 5) Definition of Done (Thesis/Pilot Ready)

The MVP is considered successful when all are true:

1. At least 3+ edge devices can be monitored simultaneously from dashboard.
2. Remote trigger executes end-to-end and returns analyzable records.
3. At least one full run stores and displays: images, detection summary, and grade.
4. Live map and operations log reflect real device status/events.
5. Weekly summary metrics can be presented in defense/pilot review.

## 6) Post-MVP Priorities (Next Phase)

1. OTA model/version management for edge and cloud inference pipeline.
2. Automated GQ-RIS API push/export workflow.
3. CSV/JSON/PDF export for batches and summary reports.
4. Role-based access control (`Admin`, `Operator`, `Viewer`).
5. Alerting integrations (email/SMS/chat) for device failures and threshold breaches.

## 7) Suggested Milestones

1. Milestone 1: Fleet heartbeat + registry + live map
2. Milestone 2: Remote trigger + pre-flight + command status
3. Milestone 3: Analysis detail pages + KPI dashboard
4. Milestone 4: Pilot hardening (logs, retries, auth, exports)
