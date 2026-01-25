"use client";

import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCopy,
  IconCheck,
  IconX,
  IconDots,
  IconClipboardList,
  IconScale,
  IconPercentage,
  IconStarFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  EvaluationTemplate,
  EvaluationSection,
  EvaluationCriterion,
  RatingScale,
  ratingScaleLabels,
  mockEvaluationTemplates,
} from "@/lib/types/performance";

export function EvaluationTemplatesManager() {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>(mockEvaluationTemplates);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<EvaluationTemplate>>({
    name: "",
    nameEn: "",
    description: "",
    ratingScale: "numeric_5",
    includesSelfReview: true,
    includesManagerReview: true,
    includes360Review: false,
    requiresCalibration: true,
    sections: [],
    isActive: true,
  });

  // Section form
  const [editingSection, setEditingSection] = useState<EvaluationSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    name: "",
    description: "",
    weight: 0,
  });

  // Criterion form
  const [editingCriterion, setEditingCriterion] = useState<{ sectionId: string; criterion: EvaluationCriterion | null } | null>(null);
  const [criterionForm, setCriterionForm] = useState({
    name: "",
    description: "",
    weight: 0,
    isRequired: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      ratingScale: "numeric_5",
      includesSelfReview: true,
      includesManagerReview: true,
      includes360Review: false,
      requiresCalibration: true,
      sections: [],
      isActive: true,
    });
  };

  const calculateTotalWeight = () => {
    return formData.sections?.reduce((sum, section) => sum + section.weight, 0) || 0;
  };

  const handleAddSection = () => {
    if (!sectionForm.name || sectionForm.weight <= 0) return;

    const newSection: EvaluationSection = {
      id: `sec-${Date.now()}`,
      name: sectionForm.name,
      description: sectionForm.description,
      weight: sectionForm.weight,
      order: (formData.sections?.length || 0) + 1,
      criteria: [],
    };

    setFormData({
      ...formData,
      sections: [...(formData.sections || []), newSection],
    });

    setSectionForm({ name: "", description: "", weight: 0 });
  };

  const handleRemoveSection = (sectionId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections?.filter((s) => s.id !== sectionId),
    });
  };

  const handleAddCriterion = (sectionId: string) => {
    if (!criterionForm.name || criterionForm.weight <= 0) return;

    const newCriterion: EvaluationCriterion = {
      id: `cr-${Date.now()}`,
      name: criterionForm.name,
      description: criterionForm.description,
      weight: criterionForm.weight,
      order: 0,
      isRequired: criterionForm.isRequired,
    };

    setFormData({
      ...formData,
      sections: formData.sections?.map((s) =>
        s.id === sectionId
          ? { ...s, criteria: [...s.criteria, { ...newCriterion, order: s.criteria.length + 1 }] }
          : s
      ),
    });

    setCriterionForm({ name: "", description: "", weight: 0, isRequired: true });
    setEditingCriterion(null);
  };

  const handleRemoveCriterion = (sectionId: string, criterionId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections?.map((s) =>
        s.id === sectionId
          ? { ...s, criteria: s.criteria.filter((c) => c.id !== criterionId) }
          : s
      ),
    });
  };

  const handleSave = () => {
    const template: EvaluationTemplate = {
      ...(formData as EvaluationTemplate),
      id: selectedTemplate?.id || `et-${Date.now()}`,
      tenantId: "tenant-1",
      totalWeight: calculateTotalWeight(),
      isDefault: selectedTemplate?.isDefault || false,
      createdAt: selectedTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditDialogOpen && selectedTemplate) {
      setTemplates(templates.map((t) => (t.id === selectedTemplate.id ? template : t)));
    } else {
      setTemplates([...templates, template]);
    }

    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedTemplate(null);
    resetForm();
  };

  const handleDuplicate = (template: EvaluationTemplate) => {
    const duplicate: EvaluationTemplate = {
      ...template,
      id: `et-${Date.now()}`,
      name: `${template.name} (نسخة)`,
      nameEn: `${template.nameEn} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, duplicate]);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const openEditDialog = (template: EvaluationTemplate) => {
    setSelectedTemplate(template);
    setFormData(template);
    setIsEditDialogOpen(true);
  };

  const getScaleIcon = (scale: RatingScale) => {
    switch (scale) {
      case "numeric_5":
        return <IconStarFilled className="h-4 w-4" />;
      case "numeric_10":
        return <IconScale className="h-4 w-4" />;
      case "percentage":
        return <IconPercentage className="h-4 w-4" />;
      default:
        return <IconClipboardList className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">نماذج التقييم</h2>
          <p className="text-muted-foreground">إدارة نماذج ومعايير تقييم الأداء</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <IconPlus className="ms-2 h-4 w-4" />
          إضافة نموذج
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>إجمالي النماذج</CardDescription>
            <CardTitle className="text-3xl">{templates.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>نماذج نشطة</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {templates.filter((t) => t.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>مع تقييم ذاتي</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {templates.filter((t) => t.includesSelfReview).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>تتطلب معايرة</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {templates.filter((t) => t.requiresCalibration).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {template.name}
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs">افتراضي</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{template.nameEn}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(template)}>
                      <IconEdit className="ms-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                      <IconCopy className="ms-2 h-4 w-4" />
                      نسخ
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(template.id)}
                      disabled={template.isDefault}
                    >
                      <IconTrash className="ms-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.description && (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getScaleIcon(template.ratingScale)}
                  {ratingScaleLabels[template.ratingScale]}
                </Badge>
                <Badge variant="outline">{template.sections.length} أقسام</Badge>
                <Badge variant="outline">
                  {template.sections.reduce((sum, s) => sum + s.criteria.length, 0)} معيار
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {template.includesSelfReview && (
                  <Badge className="bg-blue-100 text-blue-700">تقييم ذاتي</Badge>
                )}
                {template.includesManagerReview && (
                  <Badge className="bg-green-100 text-green-700">تقييم المدير</Badge>
                )}
                {template.includes360Review && (
                  <Badge className="bg-purple-100 text-purple-700">360°</Badge>
                )}
                {template.requiresCalibration && (
                  <Badge className="bg-orange-100 text-orange-700">معايرة</Badge>
                )}
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">الأقسام:</p>
                <div className="space-y-1">
                  {template.sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{section.name}</span>
                      <Badge variant="secondary">{section.weight}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedTemplate(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "تعديل نموذج التقييم" : "إضافة نموذج تقييم جديد"}
            </DialogTitle>
            <DialogDescription>
              تحديد معايير وأقسام نموذج التقييم
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium">المعلومات الأساسية</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>الاسم بالعربية *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="نموذج التقييم السنوي"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية *</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Annual Evaluation Template"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف النموذج..."
                  rows={2}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">الإعدادات</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>مقياس التقييم</Label>
                  <Select
                    value={formData.ratingScale}
                    onValueChange={(value: RatingScale) =>
                      setFormData({ ...formData, ratingScale: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ratingScaleLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.includesSelfReview}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, includesSelfReview: checked })
                    }
                  />
                  <Label>تقييم ذاتي</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.includesManagerReview}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, includesManagerReview: checked })
                    }
                  />
                  <Label>تقييم المدير</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.includes360Review}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, includes360Review: checked })
                    }
                  />
                  <Label>تقييم 360°</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.requiresCalibration}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, requiresCalibration: checked })
                    }
                  />
                  <Label>يتطلب معايرة</Label>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">أقسام التقييم</h4>
                <Badge variant={calculateTotalWeight() === 100 ? "default" : "destructive"}>
                  الوزن الإجمالي: {calculateTotalWeight()}%
                </Badge>
              </div>

              {/* Add Section Form */}
              <div className="rounded-lg border p-4 space-y-3">
                <p className="text-sm font-medium">إضافة قسم جديد</p>
                <div className="grid gap-3 md:grid-cols-4">
                  <Input
                    placeholder="اسم القسم"
                    value={sectionForm.name}
                    onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  />
                  <Input
                    placeholder="الوصف (اختياري)"
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="الوزن %"
                    value={sectionForm.weight || ""}
                    onChange={(e) => setSectionForm({ ...sectionForm, weight: Number(e.target.value) })}
                    min={1}
                    max={100}
                  />
                  <Button onClick={handleAddSection} disabled={!sectionForm.name || sectionForm.weight <= 0}>
                    <IconPlus className="ms-2 h-4 w-4" />
                    إضافة
                  </Button>
                </div>
              </div>

              {/* Sections List */}
              <Accordion type="multiple" className="space-y-2">
                {formData.sections?.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full ms-2">
                        <span className="font-medium">{section.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{section.weight}%</Badge>
                          <Badge variant="secondary">{section.criteria.length} معيار</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSection(section.id);
                            }}
                          >
                            <IconTrash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {/* Add Criterion Form */}
                        <div className="rounded-lg bg-muted p-3 space-y-2">
                          <p className="text-sm">إضافة معيار</p>
                          <div className="grid gap-2 md:grid-cols-5">
                            <Input
                              placeholder="اسم المعيار"
                              value={editingCriterion?.sectionId === section.id ? criterionForm.name : ""}
                              onChange={(e) => {
                                setEditingCriterion({ sectionId: section.id, criterion: null });
                                setCriterionForm({ ...criterionForm, name: e.target.value });
                              }}
                              onFocus={() => setEditingCriterion({ sectionId: section.id, criterion: null })}
                            />
                            <Input
                              placeholder="الوصف"
                              value={editingCriterion?.sectionId === section.id ? criterionForm.description : ""}
                              onChange={(e) => setCriterionForm({ ...criterionForm, description: e.target.value })}
                            />
                            <Input
                              type="number"
                              placeholder="الوزن %"
                              value={editingCriterion?.sectionId === section.id ? criterionForm.weight || "" : ""}
                              onChange={(e) => setCriterionForm({ ...criterionForm, weight: Number(e.target.value) })}
                              min={1}
                            />
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={criterionForm.isRequired}
                                onCheckedChange={(checked) => setCriterionForm({ ...criterionForm, isRequired: checked })}
                              />
                              <span className="text-sm">مطلوب</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddCriterion(section.id)}
                              disabled={!criterionForm.name || criterionForm.weight <= 0 || editingCriterion?.sectionId !== section.id}
                            >
                              إضافة
                            </Button>
                          </div>
                        </div>

                        {/* Criteria List */}
                        {section.criteria.length > 0 && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>المعيار</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="w-[80px]">الوزن</TableHead>
                                <TableHead className="w-[80px]">مطلوب</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {section.criteria.map((criterion) => (
                                <TableRow key={criterion.id}>
                                  <TableCell className="font-medium">{criterion.name}</TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {criterion.description || "-"}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{criterion.weight}%</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {criterion.isRequired ? (
                                      <IconCheck className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <IconX className="h-4 w-4 text-gray-400" />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleRemoveCriterion(section.id, criterion.id)}
                                    >
                                      <IconTrash className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedTemplate(null);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !formData.nameEn ||
                (formData.sections?.length || 0) === 0 ||
                calculateTotalWeight() !== 100
              }
            >
              <IconCheck className="ms-2 h-4 w-4" />
              {isEditDialogOpen ? "حفظ التعديلات" : "إضافة النموذج"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
