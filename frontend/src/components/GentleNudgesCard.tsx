import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

type GentleNudgesCardProps = {
  missingSkills: string[];
  onSeeIdeas: (skillName: string) => void;
};

export function GentleNudgesCard({
  missingSkills,
  onSeeIdeas,
}: GentleNudgesCardProps) {
  if (missingSkills.length === 0) {
    return null;
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700} color="#2d3748">
            Tips for Today
          </Typography>
          {missingSkills.map((skillName) => (
            <Alert
              key={skillName}
              severity="info"
              action={
                <Button size="small" onClick={() => onSeeIdeas(skillName)}>
                  See ideas
                </Button>
              }
            >
              Try one quick {skillName} activity today.
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
