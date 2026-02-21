import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NatureIcon from "@mui/icons-material/Nature";

type PricingPageProps = {
  isPlus: boolean;
  onNavigate?: (page: string) => void;
};

const FREE_FEATURES = [
  "Unlimited activity logging — your data is always safe",
  "1 child profile",
  "Last 90 days of charts & insights",
  "Basic activity suggestions",
  "Weekly learning snapshot",
];

const PLUS_FEATURES = [
  "Everything in Free, and…",
  "Up to 5 child profiles",
  "Full history — see all-time charts & insights",
  "Monthly & yearly trends with long-term patterns",
  "Personalized suggestions based on your child's patterns",
  "Printable PDF reports & quarterly reflection summaries",
];

function FeatureList({ features }: { features: string[] }) {
  return (
    <Stack spacing={1.5}>
      {features.map((feature) => (
        <Stack
          key={feature}
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
        >
          <CheckCircleOutlineIcon
            sx={{ color: "#67b587", fontSize: 20, mt: 0.2, flexShrink: 0 }}
          />
          <Typography variant="body2" color="text.secondary">
            {feature}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function PricingPage({ isPlus, onNavigate }: PricingPageProps) {
  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ pt: { xs: 4, md: 6 }, px: { xs: 1, md: 2 } }}>
          {/* Header */}
          <Stack spacing={2} alignItems="center" sx={{ mb: 5 }}>
            <NatureIcon sx={{ color: "#67b587", fontSize: 48 }} />
            <Typography
              variant="h4"
              fontWeight={700}
              color="#2d3748"
              textAlign="center"
            >
              Choose the plan that fits your family
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 520 }}
            >
              EarlyLedge keeps every activity you log — forever. Pick the
              visibility and features that feel right for you.
            </Typography>
          </Stack>

          {/* Plan Cards */}
          <Grid container spacing={3} justifyContent="center">
            {/* Free Plan */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  border: !isPlus ? "2px solid #67b587" : "1px solid #e2e8f0",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#2d3748"
                        >
                          Free
                        </Typography>
                        {!isPlus && (
                          <Chip
                            label="Current plan"
                            size="small"
                            sx={{
                              bgcolor: "#e8f5e9",
                              color: "#2e7d32",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mt: 1 }}
                      >
                        $0
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {" "}
                          / forever
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        A gentle start to understanding your child's learning
                        journey.
                      </Typography>
                    </Box>

                    <Divider />

                    <FeatureList features={FREE_FEATURES} />

                    {!isPlus && (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{
                          mt: 2,
                          py: 1.25,
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      >
                        Your current plan
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Plus Plan */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  border: isPlus ? "2px solid #cd975c" : "1px solid #e2e8f0",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {!isPlus && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Chip
                      icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                      label="Recommended"
                      size="small"
                      sx={{
                        bgcolor: "#cd975c",
                        color: "#fff",
                        fontWeight: 600,
                        "& .MuiChip-icon": { color: "#fff" },
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="#2d3748"
                        >
                          Plus
                        </Typography>
                        {isPlus && (
                          <Chip
                            label="Current plan"
                            size="small"
                            sx={{
                              bgcolor: "#fff3e0",
                              color: "#cd975c",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mt: 1 }}
                      >
                        Coming soon
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        The complete picture of your child's growth — calm,
                        clear, and always yours.
                      </Typography>
                    </Box>

                    <Divider />

                    <FeatureList features={PLUS_FEATURES} />

                    {isPlus ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{
                          mt: 2,
                          py: 1.25,
                          borderRadius: 2,
                          fontWeight: 600,
                        }}
                      >
                        Your current plan
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => onNavigate?.("home")}
                        sx={{
                          mt: 2,
                          py: 1.25,
                          borderRadius: 2,
                          fontWeight: 600,
                          bgcolor: "#cd975c",
                          "&:hover": { bgcolor: "#b8854d" },
                        }}
                      >
                        Notify me when Plus launches
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom reassurance */}
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Your data is always safe. We never delete your logged activities,
              regardless of plan.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
