import './DriverLicense.css';
import { User, CheckCircle } from 'lucide-react';

export default function DriverLicense() {
    const issueDate = new Date().toLocaleDateString('en-US');

    return (
        <div className="license-card-container">
            <div className="license-card">
                <div className="license-header">
                    <div className="license-title">DRIVER LICENSE</div>
                    <div className="license-state">DRIVESAFE STATE</div>
                </div>

                <div className="license-body">
                    <div className="license-photo">
                        <User size={64} color="#adb5bd" />
                    </div>

                    <div className="license-info">
                        <div className="info-group">
                            <label>CLASS</label>
                            <span>C (Regular)</span>
                        </div>
                        <div className="info-group">
                            <label>NAME</label>
                            <span className="info-highlight">ALEX DRIVER</span>
                        </div>
                        <div className="info-group">
                            <label>ISSUED</label>
                            <span>{issueDate}</span>
                        </div>
                        <div className="info-group">
                            <label>STATUS</label>
                            <span className="status-valid"><CheckCircle size={12} /> VALID</span>
                        </div>
                    </div>
                </div>

                <div className="license-footer">
                    <div className="license-id">ID: 554-992-001</div>
                    <div className="license-signature">Alex Driver</div>
                </div>
            </div>
        </div>
    );
}
