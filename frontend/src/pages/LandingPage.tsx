import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NatureIcon from "@mui/icons-material/Nature";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import logoUrl from "../assets/logo.png";

type LandingPageProps = {
  onStartFree: () => void;
  onSignIn: () => void;
};

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function SectionHeading({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="#2d3748"
        sx={{ mb: subtitle ? 1.5 : 0 }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 540, mx: "auto" }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Stack spacing={1.5} alignItems="center" sx={{ textAlign: "center" }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "#f0f7f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600} color="#2d3748">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
        {description}
      </Typography>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LandingPage({ onStartFree, onSignIn }: LandingPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            <Stack direction="row" spacing={1.5} alignItems="center">
              <img
                src={logoUrl}
                alt="EarlyLedge"
                style={{ height: 28, width: "auto" }}
              />
              {!isMobile && (
                <Typography variant="h6" fontWeight={700} fontSize="1.125rem">
                  <span style={{ color: "#5d8d92" }}>Early</span>
                  <span style={{ color: "#cd975c" }}>Ledge</span>
                </Typography>
              )}
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
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <NatureIcon
            sx={{ color: "#67b587", fontSize: 48, mb: 3, opacity: 0.9 }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            color="#2d3748"
            sx={{
              mb: 2,
              fontSize: { xs: "2rem", md: "2.75rem" },
              lineHeight: 1.2,
            }}
          >
            See the learning in everyday life.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 5,
              maxWidth: 520,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.7,
            }}
          >
            EarlyLedge helps parents of children ages 4–8 notice, track, and
            understand everyday learning — without tests, scores, or pressure.
            Just calm visibility into how your child grows.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
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
              Start Free — it takes 30 seconds
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onSignIn}
              sx={{
                borderColor: "#c4cdd5",
                color: "#4a5568",
                fontWeight: 500,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#a0aec0",
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
            >
              Sign in to your account
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* How It Works                                                     */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="md">
          <SectionHeading subtitle="No complicated setup. No learning curve.">
            How it works
          </SectionHeading>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color="#67b587"
                    fontSize="1.25rem"
                  >
                    1
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="#2d3748">
                  Log everyday activities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reading together, building with blocks, a walk in the park —
                  jot it down in seconds.
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color="#5b9bd5"
                    fontSize="1.25rem"
                  >
                    2
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="#2d3748">
                  We map them to skill areas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Literacy, numeracy, creativity, physical, social — we quietly
                  connect activities to the skills they build.
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#fff3e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color="#cd975c"
                    fontSize="1.25rem"
                  >
                    3
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="#2d3748">
                  See patterns over time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gentle charts and weekly snapshots show you the balance of
                  your child's learning — no grades, no judgments.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* Features                                                         */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <SectionHeading subtitle="Thoughtful tools that help you notice what matters.">
            Everything you need, nothing you don't
          </SectionHeading>

          <Grid container spacing={5} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureItem
                icon={
                  <VisibilityIcon sx={{ color: "#5b9bd5", fontSize: 28 }} />
                }
                title="Skill visibility"
                description="See how activities map to key skill areas like literacy, numeracy, and creativity."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureItem
                icon={<EditNoteIcon sx={{ color: "#67b587", fontSize: 28 }} />}
                title="Weekly reflections"
                description="Write a short note each week about what stood out. Build a beautiful record over time."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureItem
                icon={
                  <LightbulbOutlinedIcon
                    sx={{ color: "#cd975c", fontSize: 28 }}
                  />
                }
                title="Gentle suggestions"
                description="Get age-appropriate activity ideas tailored to skills your child hasn't explored recently."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureItem
                icon={<GroupsIcon sx={{ color: "#8c7ad9", fontSize: 28 }} />}
                title="Multi-child support"
                description="Track up to 5 children on the Plus plan — each with their own profile and learning story."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* Pricing preview                                                  */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#ffffff" }}>
        <Container maxWidth="md">
          <SectionHeading subtitle="Start for free. Upgrade when it feels right.">
            Simple, honest pricing
          </SectionHeading>

          <Grid container spacing={3} justifyContent="center">
            {/* Free */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="h5" fontWeight={700} color="#2d3748">
                        Free
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mt: 0.5 }}
                      >
                        $0
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {" "}
                          / forever
                        </Typography>
                      </Typography>
                    </Box>
                    <Divider />
                    <Stack spacing={1.25}>
                      {[
                        "1 child profile",
                        "Last 90 days of insights",
                        "Basic suggestions",
                        "Weekly snapshot",
                      ].map((f) => (
                        <Stack
                          key={f}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 18, color: "#67b587" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {f}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={onStartFree}
                      sx={{
                        py: 1.25,
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    >
                      Get started
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Plus */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#cd975c",
                      color: "#fff",
                      px: 1.5,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Coming soon
                  </Box>
                </Box>
                <CardContent sx={{ p: 3.5 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#2d3748"
                        >
                          Plus
                        </Typography>
                        <AutoAwesomeIcon
                          sx={{ color: "#cd975c", fontSize: 20 }}
                        />
                      </Stack>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mt: 0.5 }}
                      >
                        Soon
                      </Typography>
                    </Box>
                    <Divider />
                    <Stack spacing={1.25}>
                      {[
                        "Up to 5 child profiles",
                        "Full history — all-time insights",
                        "Personalized suggestions",
                        "Printable PDF reports",
                        "Long-term trend analysis",
                      ].map((f) => (
                        <Stack
                          key={f}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 18, color: "#67b587" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {f}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={onStartFree}
                      sx={{
                        py: 1.25,
                        fontWeight: 600,
                        borderRadius: 2,
                        bgcolor: "#cd975c",
                        "&:hover": { bgcolor: "#b8854d" },
                      }}
                    >
                      Start Free, upgrade later
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* Trust / Privacy                                                  */}
      {/* ================================================================ */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <ShieldIcon sx={{ color: "#5b9bd5", fontSize: 40 }} />
            <Typography variant="h5" fontWeight={700} color="#2d3748">
              Your family's data stays yours.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 460, lineHeight: 1.7 }}
            >
              We do not sell, share, or monetize your data. EarlyLedge exists to
              help parents — not advertisers. Your child's learning story
              belongs to you, always.
            </Typography>
            <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={600} color="#2d3748">
                  No ads
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ever
                </Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={600} color="#2d3748">
                  No tracking
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your data, your control
                </Typography>
              </Stack>
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="body2" fontWeight={600} color="#2d3748">
                  No selling
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  We promise
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ================================================================ */}
      {/* Final CTA                                                        */}
      {/* ================================================================ */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: "#ffffff",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <NatureIcon sx={{ color: "#67b587", fontSize: 36, mb: 2 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            color="#2d3748"
            sx={{ mb: 1.5 }}
          >
            Ready to see the learning in everyday life?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            Join parents who are building a calm, clear picture of their child's
            growth — one activity at a time.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onStartFree}
            sx={{
              bgcolor: "#67b587",
              "&:hover": { bgcolor: "#5a9a74" },
              fontWeight: 600,
              px: 5,
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
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                About
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                Privacy
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                Terms
              </Link>
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
