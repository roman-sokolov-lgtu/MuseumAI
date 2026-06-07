import { authFetch } from "../utils/api";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, QrCode, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import ExhibitDialog from "../components/ExhibitDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

export interface Exhibit {
  id: string;
  name: string;
  description: string;
  period: string;
  author: string;
  material: string;
  category: string;
  qrCode: string;
  admin_login?: string;
}

export default function Exhibits() {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExhibit, setEditingExhibit] = useState<Exhibit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExhibit, setDeletingExhibit] = useState<Exhibit | null>(null);
  const [printQrExhibit, setPrintQrExhibit] = useState<Exhibit | null>(null);

  useEffect(() => {
    fetchExhibits();
  }, []);

  const fetchExhibits = async () => {
    try {
      const response = await authFetch("/api/exhibits");
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          id: String(item.exhibit_id),
          name: item.exhibit_name,
          description: item.exhibit_description,
          period: item.exhibit_period,
          author: item.exhibit_author,
          material: item.exhibit_material,
          category: item.exhibit_category,
          qrCode: item.exhibit_qr,
          admin_login: item.admin_login,
        }));
        setExhibits(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch exhibits:", error);
    }
  };

  const filteredExhibits = exhibits.filter((exhibit) =>
    exhibit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exhibit.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exhibit.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exhibit.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingExhibit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exhibit: Exhibit) => {
    setEditingExhibit(exhibit);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (exhibit: Exhibit) => {
    setDeletingExhibit(exhibit);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingExhibit) {
      try {
        await authFetch(`/api/exhibits/${deletingExhibit.id}`, { method: "DELETE" });
        setExhibits(exhibits.filter((e) => e.id !== deletingExhibit.id));
      } catch (error) {
        console.error("Failed to delete", error);
      }
      setDeleteDialogOpen(false);
      setDeletingExhibit(null);
    }
  };

  const handleSave = async (exhibit: Exhibit) => {
    try {
      const backendPayload = {
        exhibit_name: exhibit.name,
        exhibit_description: exhibit.description,
        exhibit_qr: exhibit.qrCode || "TEMP",
        exhibit_period: exhibit.period,
        exhibit_category: exhibit.category,
        exhibit_material: exhibit.material,
        exhibit_author: exhibit.author,
      };

      if (editingExhibit) {
        const response = await authFetch(`/api/exhibits/${exhibit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendPayload),
        });
        if (response.ok) fetchExhibits();
      } else {
        const response = await authFetch("/api/exhibits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendPayload),
        });
        if (response.ok) fetchExhibits();
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Управление экспонатами</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Всего экспонатов: {exhibits.length}</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Добавить экспонат
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по названию, автору, категории или периоду..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Exhibits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibits.map((exhibit) => (
          <div
            key={exhibit.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{exhibit.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <QrCode className="w-4 h-4" />
                  <span className="text-xs font-mono">{exhibit.qrCode}</span>
                </div>
              </div>

              {exhibit.author && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{exhibit.author}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{exhibit.period}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">{exhibit.category}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">{exhibit.description}</p>

              {exhibit.admin_login && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  Обновил: {exhibit.admin_login}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(exhibit)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteClick(exhibit)}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                className="w-full mt-3 flex items-center justify-center gap-2"
                onClick={() => setPrintQrExhibit(exhibit)}
              >
                <Printer className="w-4 h-4" />
                Печать QR-кода
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredExhibits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Экспонаты не найдены</p>
        </div>
      )}

      <ExhibitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        exhibit={editingExhibit}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить экспонат?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить экспонат "{deletingExhibit?.name}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print QR Dialog */}
      <Dialog open={!!printQrExhibit} onOpenChange={() => setPrintQrExhibit(null)}>
        <DialogContent className="flex flex-col items-center justify-center py-10">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">QR-код для "{printQrExhibit?.name}"</DialogTitle>
          </DialogHeader>
          {printQrExhibit && (
            <div className="bg-white p-4 rounded-xl border flex items-center justify-center self-center w-auto">
              <QRCodeCanvas
                id="qr-canvas"
                value={`museum://exhibit/${printQrExhibit.qrCode}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Распечатайте этот код и разместите рядом с экспонатом.<br />
            При сканировании приложение откроет ИИ-ассистента для этого экспоната.
          </p>
          <DialogFooter className="mt-6 w-full">
            <Button
              className="w-full"
              onClick={() => {
                const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
                if (canvas) {
                  const url = canvas.toDataURL("image/png");
                  const link = document.createElement("a");
                  link.download = `QR_${printQrExhibit?.qrCode}.png`;
                  link.href = url;
                  link.click();
                }
              }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Сохранить для печати
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}