import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import logoUrl from "../assets/logo.png";

type TermsPageProps = {
  onBack: () => void;
  onStartFree: () => void;
  onSignIn: () => void;
};

export function TermsPage({ onBack, onStartFree, onSignIn }: TermsPageProps) {
  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh" }}>
      {/* Nav bar */}
      <Box
        sx={{
          bgcolor: "#fcf9f7",
          borderBottom: "1px solid #eee5df",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.5 }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              onClick={onBack}
              sx={{ cursor: "pointer" }}
            >
              <img
                src={logoUrl}
                alt="EarlyLedge"
                style={{ height: 28, width: "auto" }}
              />
              <Typography variant="h6" fontWeight={700} fontSize="1.125rem">
                <span style={{ color: "#5d8d92" }}>Early</span>
                <span style={{ color: "#cd975c" }}>Ledge</span>
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                onClick={onSignIn}
                sx={{
                  fontWeight: 500,
                  color: "text.secondary",
                  textTransform: "none",
                }}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                onClick={onStartFree}
                sx={{
                  bgcolor: "#67b587",
                  "&:hover": { bgcolor: "#5a9a74" },
                  fontWeight: 600,
                  px: 3,
                  borderRadius: 2,
                }}
              >
                Start Free
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 6, md: 10 } }}>
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            fontWeight={700}
            color="#2d3748"
            sx={{
              mb: 1.5,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Terms of Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
            Last updated: February 2026
          </Typography>

          <Section title="Agreement to terms">
            By accessing or using EarlyLedge ("the Service"), you agree to be
            bound by these Terms of Service. If you do not agree, please do not
            use the Service. These terms apply to all users, whether on a Free
            or Plus plan.
          </Section>

          <Section title="Description of the Service">
            EarlyLedge is a web-based tool that helps parents and guardians
            track and reflect on everyday learning activities for children ages
            4–8. The Service includes activity logging, personalised
            suggestions, weekly reflections, and optional reports.
          </Section>

          <Section title="Account registration">
            To use EarlyLedge, you must create an account with a valid email
            address and a secure password. You are responsible for maintaining
            the confidentiality of your account credentials and for all activity
            that occurs under your account.
          </Section>

          <Section title="Acceptable use">
            You agree to use the Service only for its intended purpose —
            tracking your children's learning activities. You must not misuse
            the Service, attempt to access it through unauthorised means, or use
            it in any way that violates applicable law.
          </Section>

          <Section title="Subscriptions and billing">
            EarlyLedge offers a free tier and a paid Plus plan. Free accounts
            have limited features as described on our pricing page. Plus plan
            pricing, features, and billing terms are presented at the time of
            upgrade. You may cancel your Plus plan at any time; access will
            continue until the end of the current billing period.
          </Section>

          <Section title="Your content">
            You retain ownership of all data you enter into EarlyLedge,
            including activity logs, reflections, and child profile information.
            By using the Service, you grant us a limited licence to store,
            process, and display your content solely for the purpose of
            providing the Service to you.
          </Section>

          <Section title="Service availability">
            We strive to keep EarlyLedge available and reliable, but we do not
            guarantee uninterrupted access. We may perform maintenance, updates,
            or changes to the Service from time to time. We will make reasonable
            efforts to notify you of significant planned downtime.
          </Section>

          <Section title="Limitation of liability">
            EarlyLedge is provided "as is" without warranties of any kind. To
            the fullest extent permitted by law, we shall not be liable for any
            indirect, incidental, or consequential damages arising from your use
            of the Service. Our total liability shall not exceed the amount you
            paid us in the 12 months preceding the claim.
          </Section>

          <Section title="Termination">
            You may delete your account at any time through the Settings page or
            by contacting us. We reserve the right to suspend or terminate
            accounts that violate these terms. Upon termination, your data will
            be permanently deleted within 30 days.
          </Section>

          <Section title="Changes to these terms">
            We may update these terms from time to time. If we make material
            changes, we'll notify you via email or a notice within the app. Your
            continued use of the Service after changes are posted constitutes
            acceptance of the updated terms.
          </Section>

          <Section title="Contact us" last>
            If you have any questions about these terms, please email us at{" "}
            <strong>hello@earlyledge.com</strong>.
          </Section>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          borderTop: "1px solid #eee5df",
          bgcolor: "#faf5f2",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <img
                src={logoUrl}
                alt="EarlyLedge"
                style={{ height: 20, width: "auto" }}
              />
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} EarlyLedge
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <>
      <Typography variant="h6" fontWeight={600} color="#2d3748" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ lineHeight: 1.8, mb: last ? 0 : 2 }}
      >
        {children}
      </Typography>
      {!last && <Divider sx={{ borderColor: "#eee5df", my: 3 }} />}
    </>
  );
}
