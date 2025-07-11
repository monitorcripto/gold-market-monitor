
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GraduationCap, BarChart3 } from "lucide-react";

interface BeginnerModeToggleProps {
  isBeginnerMode: boolean;
  onToggle: (enabled: boolean) => void;
}

const BeginnerModeToggle = ({ isBeginnerMode, onToggle }: BeginnerModeToggleProps) => {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <div className="flex items-center space-x-2">
        {isBeginnerMode ? (
          <GraduationCap className="w-5 h-5 text-blue-600" />
        ) : (
          <BarChart3 className="w-5 h-5 text-gray-600" />
        )}
        <Label htmlFor="beginner-mode" className="text-sm font-medium">
          {isBeginnerMode ? "Modo Iniciante" : "Modo Técnico"}
        </Label>
      </div>
      <Switch
        id="beginner-mode"
        checked={isBeginnerMode}
        onCheckedChange={onToggle}
      />
      <div className="text-xs text-muted-foreground">
        {isBeginnerMode 
          ? "Análise simplificada para quem está começando" 
          : "Análise técnica completa"
        }
      </div>
    </div>
  );
};

export default BeginnerModeToggle;
