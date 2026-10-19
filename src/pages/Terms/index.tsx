import { Link, useNavigate } from "umi";

export default function Terms() {
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
          TERMS OF SERVICE
        </h1>

        <p className="text-center text-14px text-gray-600 mb40px">
          Effective Date: <span className="font-semibold">March 6, 2026</span>{" "}
          Last Updated: <span className="font-semibold">March 6, 2026</span>
        </p>

        <div className="text-16px leading-relaxed">
          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Cerebral Labs, Inc. ("Cerebral Labs," "Blitzo," "we," "us," or "our")
              provides the Blitzo mobile application and related services
              (collectively, the "Service"). By accessing or using the Service,
              you agree to be bound by these Terms of Service ("Terms"). If you do
              not agree to these Terms, do not use the Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              You must be at least 18 years of age to use the Service. By using
              the Service, you represent and warrant that you are at least 18
              years old.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              2. Changes to Terms
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We reserve the right to modify these Terms at any time, at our sole
              discretion. We will notify you of material changes by updating the
              "Last Updated" date above and, where appropriate, by notice within
              the Service or by email. Your continued use of the Service after any
              modification constitutes your acceptance of the updated Terms. If you
              do not agree to the updated Terms, you must stop using the Service.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              3. Account Registration
            </h2>
            <p className="text-gray-800 leading-relaxed">
              To access certain features of the Service, you must create an
              account. You agree to:
            </p>
            <ul className="mt12px ml18px list-disc space-y-8px text-gray-800 leading-relaxed">
              <li>
                Provide accurate and complete information when creating your
                account and keep it up to date
              </li>
              <li>
                Maintain the confidentiality of your account credentials and not
                share them with any third party
              </li>
              <li>Accept full responsibility for all activity that occurs under your account</li>
              <li>Notify us immediately if you suspect any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-800 leading-relaxed mt12px">
              We reserve the right to suspend or terminate your account at any
              time, for any reason or no reason, at our sole discretion, with or
              without notice.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              4. The Service and In-App Balance
            </h2>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">4.1 Service Description.</span>{" "}
              Blitzo is an e-commerce experience where users can discover new
              items and compete to win it at a discount.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">4.2 In-App Balance.</span> The
              Service uses an in-app balance system ("Balance"). Balance is
              allocated by Cerebral Labs at its sole discretion. Balance has no
              monetary value, cannot be redeemed for cash or any currency, cannot
              be transferred outside the Service, and does not constitute property
              of any kind. We reserve the right to modify, reduce, cancel, or
              expire Balance at any time without notice or compensation to you.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">4.3 Deal Mechanics.</span> A user
              may shop for items and deals on the Blitzo store. A user may
              compete against other users to bid their In-App Balance for the
              deal. If the user wins, they will have the right to purchase the
              item at a predetermined discount. All deal bids outcomes are final
              and determined by the Service. We make no guarantee as to any
              particular deal outcome, discount amount, or availability of Deals
              at any time.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">
                4.4 No Guarantee of Service Availability.
              </span>{" "}
              We do not guarantee that the Service, or any feature thereof, will
              be available at any time or in any location. We may modify,
              suspend, or discontinue the Service or any feature at any time
              without notice or liability to you.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              5. Prohibited Conduct
            </h2>
            <p className="text-gray-800 leading-relaxed">You agree not to:</p>
            <ul className="mt12px ml18px list-disc space-y-8px text-gray-800 leading-relaxed">
              <li>Use the Service if you are under 18 years of age</li>
              <li>Create multiple accounts or use another person's account</li>
              <li>
                Use automated tools, bots, scripts, or other means to access or
                interact with the Service
              </li>
              <li>
                Attempt to manipulate, exploit, or circumvent any game mechanic,
                reward system, or security feature of the Service
              </li>
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable law or regulation
              </li>
              <li>Impersonate any person or entity or misrepresent your identity or affiliation</li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service or its infrastructure
              </li>
              <li>
                Reverse engineer, decompile, disassemble, or otherwise attempt to
                derive the source code of the Service
              </li>
              <li>
                Use the Service to transmit any harmful, offensive, harassing,
                defamatory, or otherwise objectionable content
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Service or
                any other user's account
              </li>
            </ul>
            <p className="text-gray-800 leading-relaxed mt12px">
              We reserve the right to investigate and take appropriate action
              against anyone who, in our sole discretion, violates these
              prohibitions, including suspending or terminating their account
              without notice or liability.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              6. Intellectual Property
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Service and all content, features, and functionality thereof —
              including but not limited to text, graphics, logos, icons, images,
              audio, and software — are owned by Cerebral Labs or its licensors
              and are protected by applicable intellectual property laws.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to access and use the Service solely for your personal,
              non-commercial use, subject to these Terms. No other rights are
              granted.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              You may not reproduce, distribute, modify, create derivative works
              of, publicly display, or exploit any part of the Service or its
              content without our prior written consent.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              7. User Content
            </h2>
            <p className="text-gray-800 leading-relaxed">
              You retain ownership of any content you submit to the Service,
              including your username and profile picture ("User Content"). By
              submitting User Content, you grant Cerebral Labs a worldwide,
              royalty-free, perpetual, irrevocable, non-exclusive, sublicensable
              license to use, reproduce, modify, adapt, publish, and display such
              User Content in connection with operating and improving the Service.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              You represent and warrant that your User Content does not violate
              any third-party rights or applicable law. We reserve the right to
              remove any User Content at our sole discretion without notice or
              liability.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              8. Third-Party Services
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The Service may integrate with or contain links to third-party
              services, including authentication providers and wallet
              infrastructure. Your use of such third-party services is governed
              by their respective terms and privacy policies. We are not
              responsible for the practices or content of any third-party services. The
              non-custodial wallet associated with your account is generated and
              managed by a third-party wallet infrastructure provider. We have no
              control over your wallet or its private keys and are not
              responsible for any loss arising from your use of that wallet.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              9. Disclaimers
            </h2>
            <p className="text-gray-900 leading-relaxed font-semibold tracking-wide">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
              SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES
              OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR SOLE
              RISK.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-900 leading-relaxed font-semibold tracking-wide">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
              CEREBRAL LABS, INC., ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES,
              AGENTS, OR LICENSORS BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT
              NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE
              LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY
              TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY
              OF SUCH DAMAGES.
            </p>
            <p className="text-gray-900 leading-relaxed font-semibold tracking-wide mt12px">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL
              CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATED
              TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED ONE HUNDRED UNITED
              STATES DOLLARS (USD $100).
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              11. Indemnification
            </h2>
            <p className="text-gray-800 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Cerebral Labs,
              Inc. and its affiliates, directors, officers, employees, agents,
              and licensors from and against any claims, liabilities, damages,
              losses, and expenses, including reasonable attorneys' fees, arising
              out of or in connection with: (a) your use of the Service; (b) your
              violation of these Terms; (c) your violation of any applicable law or
              regulation; or (d) your User Content.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              12. Dispute Resolution and Arbitration
            </h2>
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold">12.1 Informal Resolution.</span>{" "}
              Before initiating any formal proceeding, you agree to first contact
              us at{" "}
              <a
                className="text-[#FF731C] font-semibold hover:underline"
                href="mailto:info@blitzo.xyz"
              >
                info@blitzo.xyz
              </a>{" "}
              and attempt to resolve any dispute informally for at least 30 days.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">12.2 Binding Arbitration.</span> If a
              dispute cannot be resolved informally, you and Cerebral Labs agree
              that any dispute, claim, or controversy arising out of or relating
              to these Terms or the Service shall be resolved by binding
              individual arbitration administered by JAMS pursuant to its
              applicable rules, seated in New York County, New York, and governed
              by the laws of the State of New York. The arbitrator's decision
              shall be final and binding.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">12.3 Class Action Waiver.</span> TO
              THE FULLEST EXTENT PERMITTED BY LAW, YOU AND CEREBRAL LABS AGREE
              THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL
              CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED
              CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING. The arbitrator may
              not consolidate claims of more than one person.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">12.4 Exceptions.</span> Either party
              may seek emergency injunctive or other equitable relief in a court
              of competent jurisdiction to prevent irreparable harm pending
              arbitration.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">12.5 Governing Law.</span> These
              Terms shall be governed by the laws of the State of New York,
              without regard to its conflict of law provisions. Any court
              proceedings permitted under these Terms shall be brought exclusively
              in the state or federal courts located in New York County, New York.
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              <span className="font-semibold">12.6 Limitation on Claims.</span> Any
              claim or cause of action arising out of or related to these Terms or
              the Service must be filed within one (1) year after such claim
              arose, or it will be forever barred.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              13. Termination
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We may suspend or terminate your access to the Service at any time,
              for any reason or no reason, at our sole discretion, without notice
              or liability. You may stop using the Service at any time and may
              request account deletion by contacting us at{" "}
              <a
                className="text-[#FF731C] font-semibold hover:underline"
                href="mailto:info@blitzo.xyz"
              >
                info@blitzo.xyz
              </a>
              .
            </p>
            <p className="text-gray-800 leading-relaxed mt12px">
              Upon termination, all licenses and rights granted to you under
              these Terms will immediately terminate. Sections 6, 9, 10, 11, 12,
              and 14 shall survive termination.
            </p>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              14. Apple App Store Additional Terms
            </h2>
            <p className="text-gray-800 leading-relaxed">
              The following terms apply to the extent you access the Service
              through Apple's App Store:
            </p>
            <div className="mt12px space-y-10px text-gray-800 leading-relaxed">
              <p>
                These Terms are between you and Cerebral Labs only, and not with
                Apple, Inc. ("Apple"). Apple is not responsible for the Service
                or its content.
              </p>
              <p>
                The license granted to you is a non-transferable license to use
                the Service on any Apple-branded device you own or control, as
                permitted by the App Store Terms of Service.
              </p>
              <p>Apple has no obligation to provide maintenance or support for the Service.</p>
              <p>
                Apple is not responsible for any product liability claims, failure
                to conform to applicable legal or regulatory requirements, or
                claims by third parties relating to the Service or your use of it.
              </p>
              <p>
                Apple and its subsidiaries are third-party beneficiaries of these
                Terms. Upon your acceptance of these Terms, Apple will have the
                right to enforce these Terms against you as a third-party
                beneficiary.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb20px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              15. Miscellaneous
            </h2>
            <div className="space-y-10px text-gray-800 leading-relaxed">
              <p>
                <span className="font-semibold">Entire Agreement.</span> These Terms,
                together with our Privacy Policy, constitute the entire agreement
                between you and Cerebral Labs with respect to the Service and
                supersede all prior agreements.
              </p>
              <p>
                <span className="font-semibold">Severability.</span> If any provision
                of these Terms is found to be invalid or unenforceable, the
                remaining provisions will remain in full force and effect.
              </p>
              <p>
                <span className="font-semibold">No Waiver.</span> Our failure to
                enforce any provision of these Terms shall not constitute a waiver
                of that provision.
              </p>
              <p>
                <span className="font-semibold">Force Majeure.</span> We shall not
                be liable for any failure or delay in performance due to causes
                beyond our reasonable control, including natural disasters, acts
                of government, pandemics, or infrastructure failures.
              </p>
              <p>
                <span className="font-semibold">Assignment.</span> You may not
                assign or transfer any rights or obligations under these Terms
                without our prior written consent. We may freely assign these
                Terms.
              </p>
              <p>
                <span className="font-semibold">Language.</span> These Terms are in
                English. In the event of any conflict between an English version
                and a translated version, the English version shall control.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-20px p-24px md:p-36px mb40px shadow-sm">
            <h2 className="text-22px md:text-26px font-bold mb14px text-gray-900 border-b-2 border-[#FF731C] pb-10px">
              16. Contact Us
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
              These Terms of Service apply solely to the Blitzo mobile application
              and do not apply to any other products or services of Cerebral Labs.
            </p>
          </section>
        </div>

        <div className="flex-center mt50px mb40px">
          <Link to="/" className="text-[#FF731C] font-semibold text-18px hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
