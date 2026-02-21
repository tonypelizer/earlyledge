import { Container, Typography, Box } from "@mui/material";

import { ChildrenPanel } from "../components/ChildrenPanel";
import type { Child } from "../types";

type ChildrenPageProps = {
  children: Child[];
  selectedChildId: number | "";
  childNameInput: string;
  childDateOfBirthInput: string;
  isEditingChild: boolean;
  onSelectedChildChange: (childId: number) => void;
  onChildNameChange: (name: string) => void;
  onChildDateOfBirthChange: (date: string) => void;
  onAddChild: () => void;
  onStartEditChild: () => void;
  onUpdateChild: () => void;
  onCancelEdit: () => void;
  onDeleteChild: () => void;
};

export function ChildrenPage({
  children,
  selectedChildId,
  childNameInput,
  childDateOfBirthInput,
  isEditingChild,
  onSelectedChildChange,
  onChildNameChange,
  onChildDateOfBirthChange,
  onAddChild,
  onStartEditChild,
  onUpdateChild,
  onCancelEdit,
  onDeleteChild,
}: ChildrenPageProps) {
  return (
    <Container maxWidth="md">
      <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#2d3748"
          sx={{ mb: 3 }}
        >
          Manage Children
        </Typography>

        <ChildrenPanel
          childrenList={children}
          selectedChildId={selectedChildId}
          childNameInput={childNameInput}
          childDateOfBirthInput={childDateOfBirthInput}
          isEditing={isEditingChild}
          onSelectedChildChange={onSelectedChildChange}
          onChildNameChange={onChildNameChange}
          onChildDateOfBirthChange={onChildDateOfBirthChange}
          onAddChild={onAddChild}
          onStartEditChild={onStartEditChild}
          onUpdateChild={onUpdateChild}
          onCancelEdit={onCancelEdit}
          onDeleteChild={onDeleteChild}
        />
      </Box>
    </Container>
  );
}
