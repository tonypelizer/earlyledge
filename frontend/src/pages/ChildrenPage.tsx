import { Container, Typography, Box } from "@mui/material";

import { ChildrenPanel } from "../components/ChildrenPanel";
import { UpgradeBanner } from "../components/UpgradeBanner";
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
  isPlus?: boolean;
  maxChildren?: number;
  childCount?: number;
  onNavigateToPricing?: () => void;
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
  isPlus = false,
  maxChildren = 1,
  childCount = 0,
  onNavigateToPricing,
}: ChildrenPageProps) {
  const atLimit = childCount >= maxChildren;

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

        {atLimit && !isPlus && (
          <Box sx={{ mb: 3 }}>
            <UpgradeBanner
              message={`Your Free plan supports ${maxChildren} child profile.`}
              description="Upgrade to Plus to add up to 5 child profiles and unlock the full learning story."
              onUpgrade={onNavigateToPricing}
              ctaLabel="See Plus plan"
              compact
            />
          </Box>
        )}

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
          disableAdd={atLimit && !isEditingChild}
        />
      </Box>
    </Container>
  );
}
