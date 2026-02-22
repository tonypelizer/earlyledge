import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import logoUrl from "../assets/logo.png";
import heroLogoUrl from "../assets/earlyledge.png";

type AboutPageProps = {
  onBack: () => void;
  onStartFree: () => void;
  onSignIn: () => void;
};

export function AboutPage({ onBack, onStartFree, onSignIn }: AboutPageProps) {
  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh" }}>
      {/* ================================================================ */}
      {/* Nav bar                                                          */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/* Hero                                                             */}
      {/* ================================================================ */}
      <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <img
            src={heroLogoUrl}
            alt="EarlyLedge"
            style={{ height: 72, width: "auto", marginBottom: 24 }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            color="#2d3748"
            sx={{
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            About EarlyLedge
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 560,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
            }}
          >
            A calm, simple tool that helps parents see the learning already
            happening in their child's everyday life.
          </Typography>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "#eee5df" }} />

      {/* ================================================================ */}
      {/* Story                                                            */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            fontWeight={700}
            color="#2d3748"
            sx={{ mb: 2 }}
          >
            Why we built this
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8, mb: 3 }}
          >
            Children ages 4–8 are learning all the time — building with blocks,
            asking "why" questions, negotiating with siblings, making up
            stories. But most of that growth is invisible. It doesn't come with
            grades or report cards.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8, mb: 3 }}
          >
            EarlyLedge was created for parents who want a quiet way to notice
            and remember those moments. Not to measure or compare, but to
            appreciate how their child is growing — and to have a gentle record
            they can look back on.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.8 }}
          >
            We believe learning doesn't need to be tracked with pressure. A few
            minutes a week — logging an activity, reading a suggestion, writing
            a short reflection — is enough to build a beautiful picture over
            time.
          </Typography>
        </Container>
      </Box>

      <Divider sx={{ borderColor: "#eee5df" }} />

      {/* ================================================================ */}
      {/* Principles                                                       */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            fontWeight={700}
            color="#2d3748"
            sx={{ mb: 3 }}
          >
            What we believe
          </Typography>

          {[
            {
              title: "Calm over competitive",
              body: "There are no leaderboards, no comparisons, no scores. Just a clear view of your child's world.",
            },
            {
              title: "Simple over complex",
              body: "We keep things minimal on purpose. A handful of screens, a few minutes a week. That's the whole idea.",
            },
            {
              title: "Parents know best",
              body: "You know your child better than any algorithm. We offer gentle suggestions and visibility — never prescriptions.",
            },
            {
              title: "Privacy first",
              body: "Your family's data is yours. We don't sell it, share it, or use it for advertising. Ever.",
            },
          ].map(({ title, body }) => (
            <Box key={title} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="#2d3748"
                sx={{ mb: 0.5 }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {body}
              </Typography>
            </Box>
          ))}
        </Container>
      </Box>

      <Divider sx={{ borderColor: "#eee5df" }} />

      {/* ================================================================ */}
      {/* CTA                                                              */}
      {/* ================================================================ */}
      <Box
        sx={{ py: { xs: 6, md: 8 }, textAlign: "center", bgcolor: "#ffffff" }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h5"
            fontWeight={700}
            color="#2d3748"
            sx={{ mb: 1.5 }}
          >
            Ready to start?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            It's free, takes 30 seconds, and you can always upgrade later.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onStartFree}
            sx={{
              bgcolor: "#67b587",
              "&:hover": { bgcolor: "#5a9a74" },
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
            }}
          >
            Start Free
          </Button>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* Footer                                                           */}
      {/* ================================================================ */}
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

            <Stack direction="row" spacing={3}>
              <Link
                href="mailto:hello@earlyledge.com"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                Contact
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
