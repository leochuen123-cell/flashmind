import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  FileJson,
  AlertTriangle,
  Check,
  Database,
} from 'lucide-react';
import type { Card as CardType, Tag as TagType } from '@/types';

interface DataManagerProps {
  cards: CardType[];
  tags: TagType[];
  onImport: (data: { cards: CardType[]; tags: TagType[] }) => void;
}

export function DataManager({ cards, tags, onImport }: DataManagerProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [importData, setImportData] = useState<{ cards: CardType[]; tags: TagType[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      cards,
      tags,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flashmind-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully!', {
      description: `Exported ${cards.length} cards and ${tags.length} tags`,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.cards || !Array.isArray(data.cards)) {
          throw new Error('Invalid data: cards array missing');
        }
        if (!data.tags || !Array.isArray(data.tags)) {
          throw new Error('Invalid data: tags array missing');
        }

        setImportData({ cards: data.cards as CardType[], tags: data.tags as TagType[] });
        setShowConfirmDialog(true);
      } catch (error) {
        toast.error('Failed to parse file', {
          description: error instanceof Error ? error.message : 'Invalid JSON file',
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (!importData) return;

    onImport(importData);
    setShowConfirmDialog(false);
    setShowImportDialog(false);
    setImportData(null);

    toast.success('Data imported successfully!', {
      description: `Imported ${importData.cards.length} cards and ${importData.tags.length} tags`,
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="w-6 h-6 text-violet-500" />
          Data Management
        </h2>
        <p className="text-slate-500 mt-1">
          Export your data for backup or import data from another device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-lg mb-1">Export Data</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Download all your cards and tags as a JSON file for backup.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FileJson className="w-4 h-4" />
                    {cards.length} cards
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    {tags.length} tags
                  </span>
                </div>
                <Button
                  onClick={handleExport}
                  className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Download className="w-4 h-4" />
                  Export to JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-lg mb-1">Import Data</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Import cards and tags from a JSON file. This will replace all current data.
                </p>
                <div className="p-3 bg-amber-50 rounded-lg mb-4">
                  <p className="text-sm text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Importing will replace all your current cards and tags.</span>
                  </p>
                </div>
                <Button
                  onClick={() => setShowImportDialog(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import from JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Select a FlashMind backup file to import. This will replace all your current data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Click to select a file</p>
              <p className="text-sm text-slate-400 mt-1">or drag and drop a JSON file here</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Import Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Confirm Import
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will replace all your current data with the imported data.
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Current data:</strong> {cards.length} cards, {tags.length} tags
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Importing:</strong> {importData?.cards.length} cards, {importData?.tags.length} tags
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImportData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImport}
              className="bg-violet-500 hover:bg-violet-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
