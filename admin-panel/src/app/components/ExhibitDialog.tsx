import { useEffect, useState } from "react";
import type { Exhibit } from "../pages/Exhibits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ExhibitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibit: Exhibit | null;
  onSave: (exhibit: Exhibit) => void;
}

export default function ExhibitDialog({
  open,
  onOpenChange,
  exhibit,
  onSave,
}: ExhibitDialogProps) {
  const [formData, setFormData] = useState<Partial<Exhibit>>({
    name: "",
    description: "",
    period: "",
    author: "",
    material: "",
    category: "",
  });

  useEffect(() => {
    if (exhibit) {
      setFormData(exhibit);
    } else {
      setFormData({
        name: "",
        description: "",
        period: "",
        author: "",
        material: "",
        category: "",
      });
    }
  }, [exhibit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.period && formData.author && formData.material && formData.category) {
      onSave({
        ...formData,
        id: exhibit?.id || "",
        qrCode: exhibit?.qrCode || "",
      } as Exhibit);
    }
  };

  const handleChange = (field: keyof Exhibit, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>
            {exhibit ? "Редактировать экспонат" : "Добавить экспонат"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Введите название экспоната"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Автор <span className="text-red-500">*</span></Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="Введите имя автора"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Период создания <span className="text-red-500">*</span></Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => handleChange("period", e.target.value)}
              placeholder="Например: 1503-1519"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Введите описание экспоната"
              rows={4}
              required
              className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Материал <span className="text-red-500">*</span></Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value)}
                placeholder="Например: Масло, холст"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория <span className="text-red-500">*</span></Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Например: Живопись"
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {exhibit ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
