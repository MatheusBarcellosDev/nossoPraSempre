'use client';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Design simples e elegante com foco nas suas fotos',
  },
  {
    id: 'romantico',
    name: 'Romântico',
    description: 'Layout delicado com elementos decorativos e cores suaves',
  },
  {
    id: 'moderno',
    name: 'Moderno',
    description: 'Visual contemporâneo com design arrojado e dinâmico',
  },
];

export default function TemplateSelector({
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Escolha um Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-pink-500 ring-2 ring-pink-500'
                : 'hover:border-gray-400'
            }`}
            onClick={() => onSelect(template.id)}
          >
            <h4 className="font-medium mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
