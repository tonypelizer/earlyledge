import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import type { Suggestion } from "../types";

type SuggestionsCardProps = {
  suggestions: Suggestion[];
};

export function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Suggestions
        </Typography>
        <List>
          {suggestions.map((suggestion) => (
            <ListItem key={suggestion.id}>
              <ListItemText
                primary={`${suggestion.title} (${suggestion.skill_name})`}
                secondary={suggestion.description}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
