import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import logoUrl from "../assets/logo.png";

type PrivacyPageProps = {
  onBack: () => void;
  onStartFree: () => void;
  onSignIn: () => void;
};

export function PrivacyPage({
  onBack,
  onStartFree,
  onSignIn,
}: PrivacyPageProps) {
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
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
            Last updated: February 2026
          </Typography>

          <Section title="Overview">
            EarlyLedge ("we", "us", "our") is a simple tool that helps parents
            track their children's everyday learning activities. We take your
            privacy seriously and are committed to protecting the personal
            information you share with us.
          </Section>

          <Section title="Information we collect">
            We collect only what's needed to provide the service: your email
            address and password for authentication, your children's names and
            dates of birth to personalise the experience, and the activity and
            reflection data you choose to log. We do not collect data from
            children directly — all information is entered by the parent.
          </Section>

          <Section title="How we use your information">
            Your data is used solely to provide and improve the EarlyLedge
            service. This includes displaying your dashboard, generating
            personalised suggestions, and producing reports. We do not sell,
            rent, or share your personal information with third parties for
            marketing purposes.
          </Section>

          <Section title="Data storage and security">
            Your data is stored securely using industry-standard encryption and
            hosting practices. We use HTTPS for all data transmission and store
            data in secure, access-controlled environments. Only authorised
            personnel have access to production data, and only when necessary
            for support or maintenance.
          </Section>

          <Section title="Cookies and tracking">
            EarlyLedge uses only essential cookies required for authentication
            and session management. We do not use third-party tracking cookies,
            analytics trackers, or advertising pixels.
          </Section>

          <Section title="Your rights">
            You can view, update, or delete your data at any time through the
            Settings page in your account. If you'd like to request a full
            export or permanent deletion of all your data, contact us at{" "}
            <strong>hello@earlyledge.com</strong> and we'll respond within 7
            days.
          </Section>

          <Section title="Children's privacy">
            EarlyLedge is designed for use by parents and guardians. We do not
            knowingly collect information directly from children. All data about
            children is provided by and managed by their parent or guardian.
          </Section>

          <Section title="Changes to this policy">
            We may update this policy from time to time. If we make significant
            changes, we'll notify you via email or a notice within the app. Your
            continued use of EarlyLedge after changes are posted constitutes
            acceptance of the updated policy.
          </Section>

          <Section title="Contact us" last>
            If you have any questions about this privacy policy, please email us
            at <strong>hello@earlyledge.com</strong>.
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
