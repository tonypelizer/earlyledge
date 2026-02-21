import { Box, Button, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type UpgradeBannerProps = {
  /** Primary message, e.g. "Unlock your child's full learning story with Plus." */
  message?: string;
  /** Optional secondary line of copy. */
  description?: string;
  /** Where the CTA navigates to. */
  onUpgrade?: () => void;
  /** Override CTA label. */
  ctaLabel?: string;
  /** Compact mode for inline banners. */
  compact?: boolean;
};

export function UpgradeBanner({
  message = "Unlock your child's full learning story with Plus.",
  description = "See long-term patterns, personalized suggestions, and printable summaries.",
  onUpgrade,
  ctaLabel = "Learn about Plus",
  compact = false,
}: UpgradeBannerProps) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f0f7f4 0%, #e8f4fd 100%)",
        border: "1px solid #d4e8dc",
        borderRadius: 2,
        p: compact ? 2 : 3,
        textAlign: "center",
      }}
    >
      <Stack spacing={compact ? 1 : 1.5} alignItems="center">
        {!compact && (
          <AutoAwesomeIcon sx={{ color: "#cd975c", fontSize: 32 }} />
        )}
        <Typography
          variant={compact ? "body1" : "h6"}
          fontWeight={600}
          color="#2d3748"
        >
          {message}
        </Typography>
        {description && !compact && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 440 }}
          >
            {description}
          </Typography>
        )}
        {onUpgrade && (
          <Button
            variant="contained"
            size={compact ? "small" : "medium"}
            onClick={onUpgrade}
            sx={{
              mt: compact ? 0.5 : 1,
              bgcolor: "#cd975c",
              "&:hover": { bgcolor: "#b8854d" },
              fontWeight: 600,
              px: 3,
            }}
          >
            {ctaLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
