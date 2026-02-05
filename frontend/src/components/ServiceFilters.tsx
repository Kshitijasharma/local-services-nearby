import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CATEGORIES, RADIUS_OPTIONS } from "@/lib/constants";
import type {
  ServiceFilters as FilterType,
  ServiceCategory
} from "@/types";

/* ------------------------------------------------------------------
   Props
-------------------------------------------------------------------*/

interface ServiceFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  resultCount: number;
}

/* ------------------------------------------------------------------
   Component
-------------------------------------------------------------------*/

export const ServiceFilters = memo(function ServiceFilters({
  filters,
  onFiltersChange,
  resultCount
}: ServiceFiltersProps) {
  /* ---------------------------
     Handlers
  ----------------------------*/

  const handleCategoryChange = (category: ServiceCategory) => {
    onFiltersChange({ ...filters, category });
  };

  const handleRadiusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      radius: parseInt(value, 10)
    });
  };

  const handleSortChange = (value: "distance" | "rating") => {
    onFiltersChange({
      ...filters,
      sortBy: value
    });
  };

  const handleOpenNowChange = (checked: boolean) => {
    onFiltersChange({ ...filters, openNow: checked });
  };

  /* ------------------------------------------------------------------
     Render
  -------------------------------------------------------------------*/

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Service categories"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`category-pill ${
              filters.category === cat.id
                ? "category-pill-active"
                : "category-pill-inactive"
            }`}
            aria-pressed={filters.category === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Radius Select */}
        <div className="flex items-center gap-2">
          <Label
            htmlFor="radius-select"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Within
          </Label>

          <Select
            value={filters.radius.toString()}
            onValueChange={handleRadiusChange}
          >
            <SelectTrigger id="radius-select" className="w-24">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {RADIUS_OPTIONS.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <Label
            htmlFor="sort-select"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Sort by
          </Label>

          <Select
            value={filters.sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger id="sort-select" className="w-28">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Open Now Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="open-now"
            checked={filters.openNow}
            onCheckedChange={handleOpenNowChange}
            aria-label="Show only open services"
          />

          <Label htmlFor="open-now" className="text-sm cursor-pointer">
            Open now
          </Label>
        </div>

        {/* Result Count */}
        <div className="ml-auto text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </div>
      </div>
    </div>
  );
});
