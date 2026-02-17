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
    <Card
      sx={{ borderRadius: 3, boxShadow: "0 8px 20px rgba(20, 35, 70, 0.06)" }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Tips for Today</Typography>
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
