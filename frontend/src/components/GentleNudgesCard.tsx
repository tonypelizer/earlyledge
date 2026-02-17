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
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Gentle nudges</Typography>
          {missingSkills.map((skillName) => (
            <Alert
              key={skillName}
              severity="info"
              action={
                <Button onClick={() => onSeeIdeas(skillName)}>See ideas</Button>
              }
            >
              It&apos;s been a while since {skillName} showed up. Would you like
              a simple idea?
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
