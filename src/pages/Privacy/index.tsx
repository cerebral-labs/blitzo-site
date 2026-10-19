import { Link, useNavigate } from "umi";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="box-border py40px px20px md:px40px bg-[#FAFAFA] min-h-100vh">
      <div className="max-w-900px mx-auto">
        <div className="text-center mb50px">
          <p
            onClick={() => navigate(-1)}
            className="text-32px text-[#FF731C] cursor-pointer select-none"
            style={{
              fontFamily: "Tomorrow",
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            Blitzo
          </p>
        </div>

        <h1 className="text-36px md:text-44px font-bold mb18px text-center">
          PRIVACY POLICY
        </h1>

        <p className="text-center text-14px text-gray-600 mb40px">
          <span className="font-semibold"></span>Effective Date:{" "}
          <span className="font-semibold">March 6, 2026</span> Last Updated:{" "}
          <span className="font-semibold">March 6, 2026</span>
        </p>

        <div className="text-16px leading-relaxed">
          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              1. Introduction
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Cerebral Labs, Inc. ("Cerebral Labs," "Blitzo," "we," "us," or
              "our") operates the Blitzo mobile application (the "App") and
              related services (collectively, the "Service"). Blitzo is an
              e-commerce experience where users can discover new items and
              compete to win it at a discount using in-app balance provided by
              the platform.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              This Privacy Policy explains what personal information we collect
              when you use the Service, how we use and share it, and what
              choices you have. By using the Service, you agree to the practices
              described in this Privacy Policy.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              If you are a California resident, please see Section 9 (California
              Privacy Rights) for additional disclosures under the CCPA/CPRA.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              2. Information We Collect
            </h2>

            <h3 className="text-18px md:text-20px font-bold mt18px mb10px text-gray-900">
              2.1 Information You Provide Directly
            </h3>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">Account and Identity Data.</span>{" "}
              When you create an account, we collect your first and last name,
              email address, date of birth (to verify you are at least 18 years
              of age), username, profile picture (uploaded from your photo
              library or captured using your device camera), and phone number
              (optional).
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Authentication Data.</span> You
              may sign in using Google, Apple, or email and password. When you
              authenticate through Google or Apple, we receive limited profile
              information (such as your name and email address) as permitted by
              your settings on that platform. Authentication and wallet
              infrastructure are powered by a third-party authentication
              provider, which also automatically creates a non-custodial
              EVM-compatible wallet for each registered user.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Communications Data.</span> If you
              contact us for support or otherwise communicate with us, we
              collect the content of those communications.
            </p>

            <h3 className="text-18px md:text-20px font-bold mt22px mb10px text-gray-900">
              2.2 Information Generated Through Your Use of the Service
            </h3>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">Bumb Activity Data.</span> When
              you send or receive a Bumb, we collect the Bumb configuration
              (size, number of recipients), the unique shareable link associated
              with each Bumb, game participation records (whether a recipient
              played, game outcome, rewards earned or forfeited), and in-app
              balance history associated with your account.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Profile and Social Data.</span> We
              collect your username, profile picture, and any linked third-party
              social accounts you voluntarily connect to the Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Device and Technical Data.</span>{" "}
              We automatically collect device type, operating system and
              version, device model, IP address, app version and session
              identifiers, unique device identifiers, and crash logs and
              performance diagnostics.
            </p>

            <h3 className="text-18px md:text-20px font-bold mt22px mb10px text-gray-900">
              2.3 Camera and Photo Library Access
            </h3>
            <p className="text-gray-800 leading-relaxed">
              If you choose to set or update your profile picture, the Service
              will request access to your device camera and/or photo library. We
              only access your camera or photos when you actively initiate this
              action. We do not access, scan, or store any photos beyond the
              image you select.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">
                Service Delivery and Operations.
              </span>{" "}
              We use your information to create and maintain your account,
              allocate and track in-app balance, process Bumb creation,
              distribution, and game outcomes, enable shareable Bumb links, and
              authenticate your identity and maintain session security.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Age Verification.</span> We
              collect your date of birth solely to verify that you are at least
              18 years of age, as required to use the Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Communications.</span> We use your
              contact information to send transactional notifications (e.g.,
              Bumb sent, reward received, game outcome), service-related
              announcements, security alerts, support messages, and marketing
              communications where you have opted in (you may opt out at any
              time; see Section 7).
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">
                Safety, Fraud Prevention, and Legal Protection.
              </span>{" "}
              We use information to detect and prevent fraudulent or
              unauthorized activity, enforce our Terms of Service, and comply
              with lawful requests from government authorities.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Service Improvement.</span> We use
              aggregated, de-identified data derived from usage information to
              understand how users interact with the Service, diagnose technical
              issues, and improve features. This data does not identify you
              individually.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              4. How We Share Your Information
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We do not sell your personal information.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Service Providers.</span> We share
              information with third-party vendors that help us operate the
              Service, including third-party authentication and wallet
              infrastructure provider, cloud hosting and infrastructure
              providers, analytics and crash-reporting providers, and customer
              support tools. These service providers are contractually required
              to use your information only to perform services on our behalf and
              consistent with this Privacy Policy.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Other Users (Limited).</span> Your
              username and profile picture are visible to other users within the
              Service. The availability of a Bumb is visible to recipients via
              the shareable link. We do not expose your account details, device
              information, or activity history to other users.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Business Transfers.</span> If
              Cerebral Labs is involved in a merger, acquisition, financing, or
              sale of assets, your information may be transferred as part of
              that transaction. We will notify you of any such change via the
              Service or by email.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">
                Legal and Compliance Disclosures.
              </span>{" "}
              We may disclose your information where we believe in good faith
              that disclosure is necessary to comply with applicable law,
              respond to legal process, protect the rights or safety of Cerebral
              Labs, our users, or the public, or enforce our Terms of Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">With Your Consent.</span> We may
              share your information with third parties when you have given us
              explicit consent to do so.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              5. Data Retention
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We retain your personal information for as long as your account
              remains active and for a reasonable period thereafter, to fulfill
              the purposes described in this Privacy Policy, comply with legal
              obligations, resolve disputes, and enforce our agreements. When
              you delete your account, we will delete or anonymize your personal
              information within a reasonable period, except where retention is
              required by applicable law.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              6. Third-Party Services and Links
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Service may contain links to third-party websites or services,
              including app stores and social platforms through which Bumb links
              are shared. We are not responsible for the privacy practices of
              those third parties and encourage you to review their privacy
              policies.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              7. Your Choices
            </h2>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">Account Information.</span> You
              may review and update your username and profile picture directly
              within the Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Marketing Communications.</span>{" "}
              You may opt out of marketing emails at any time by clicking
              "unsubscribe" in any marketing email or by contacting us. Opting
              out does not affect transactional or service-related messages.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Push Notifications.</span> You may
              disable push notifications at any time in your device operating
              system settings.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Camera and Photo Access.</span>{" "}
              You may revoke the Service's access to your camera or photo
              library at any time in your device settings.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">Delete Your Account.</span> You
              may request deletion of your account by contacting us at the
              address in Section 13. We will delete or anonymize your personal
              information following your request, subject to any applicable
              retention obligations.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              8. Security
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We implement technical, organizational, and physical safeguards to
              protect your personal information against unauthorized access,
              loss, or misuse, including encrypted data transmission and access
              controls. Our service providers maintain their own security
              standards applicable to the data they process on our behalf. No
              security system is impenetrable and we cannot guarantee the
              absolute security of your information. If you believe your account
              has been compromised, please contact us immediately.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              9. California Privacy Rights (CCPA/CPRA)
            </h2>
            <p className="text-gray-800 leading-relaxed">
              If you are a California resident, you have the following rights:
            </p>
            <div className="mt12px space-y-10px text-gray-800 leading-relaxed">
              <p>
                <span className="font-semibold">Right to Know.</span> You may
                request disclosure of the categories and specific pieces of
                personal information we have collected about you, the sources,
                the purposes, and the categories of third parties with whom it
                was shared.
              </p>
              <p>
                <span className="font-semibold">Right to Delete.</span> You may
                request deletion of personal information we have collected about
                you, subject to certain legal exceptions.
              </p>
              <p>
                <span className="font-semibold">Right to Correct.</span> You may
                request correction of inaccurate personal information we
                maintain about you.
              </p>
              <p>
                <span className="font-semibold">
                  Right to Opt Out of Sale or Sharing.
                </span>{" "}
                We do not sell or share your personal information for
                cross-context behavioral advertising.
              </p>
              <p>
                <span className="font-semibold">Right to Non-Discrimination.</span>{" "}
                We will not discriminate against you for exercising your
                privacy rights.
              </p>
              <p>
                Categories of Personal Information Collected in the Past 12
                Months: Identifiers (name, email address, username, device
                identifiers, IP address); internet or other electronic network
                activity information (app usage data, session data); and
                inferences drawn from the above to understand user preferences.
              </p>
              <p>
                <span className="font-semibold">How to Submit a Request.</span>{" "}
                Contact us using the information in Section 13. We will verify
                your identity before processing your request and will respond
                within 45 days as permitted by the CCPA.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              10. Children
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Service is intended solely for users who are 18 years of age
              or older. We do not knowingly collect personal information from
              individuals under 18. If you believe we have inadvertently
              collected information from a minor, please contact us immediately
              and we will delete that information promptly.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              11. International Data Transfers
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Cerebral Labs is headquartered in the United States. If you access
              the Service from outside the United States, your information may
              be transferred to and processed in the United States, where data
              protection laws may differ from those in your jurisdiction.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We may update this Privacy Policy from time to time. Material
              changes will be communicated by updating the "Last Updated" date
              above and, where appropriate, by notice within the Service or by
              email. Your continued use of the Service after the effective date
              of any update constitutes acceptance of the revised Privacy Policy.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb40px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              13. Contact Us
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Cerebral Labs, Inc. (Blitzo) Email:{" "}
              <a
                className="text-[#FF731C] font-semibold hover:underline"
                href="mailto:info@blitzo.xyz"
              >
                info@blitzo.xyz
              </a>{" "}
              Mail: 228 Park Ave S PMB 333976, New York, NY 10003-1502
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              This Privacy Policy applies solely to the Blitzo mobile
              application and does not apply to any other products or services
              of Cerebral Labs.
            </p>
          </section>
        </div>

        <div className="flex-center mt50px mb40px">
          <Link
            to="/"
            className="text-[#FF731C] font-semibold text-18px hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

