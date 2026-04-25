# Form and Button Extraction

## Field label resolution (priority order)

1. `<label htmlFor="fieldId">Label text</label>` — most reliable
2. `aria-label="..."` on the input
3. `placeholder="..."` — acceptable when no label exists
4. `name="..."` — last resort, convert snake_case/camelCase to Title Case

## Field type mapping

| HTML type | Manual description |
|-----------|-------------------|
| `email` | Email address |
| `password` | Password |
| `text` | Text |
| `number` | Number |
| `tel` | Phone number |
| `date` | Date |
| `checkbox` | Checkbox (on/off) |
| `radio` | Radio (choose one) |
| `file` | File upload |
| `search` | Search query |

## Component library patterns

### shadcn/ui
```tsx
<FormField name="email">
  <FormLabel>Email</FormLabel>
  <FormControl><Input /></FormControl>
</FormField>
```
→ Extract `FormLabel` text as field label, `name` prop as field id.

### Material UI (MUI)
```tsx
<TextField label="Email" name="email" />
```
→ Extract `label` prop directly.

### Ant Design
```tsx
<Form.Item label="Email" name="email">
  <Input />
</Form.Item>
```
→ Extract `Form.Item` `label` prop.

## Button classification

| Text pattern | Classification |
|-------------|---------------|
| Sign in, Log in, Sign up, Register | Primary auth action |
| Save, Submit, Confirm, Update | Primary form submit |
| Cancel, Back, Close, Dismiss | Secondary / destructive |
| Delete, Remove, Archive | Destructive |
| Next, Continue, Proceed | Multi-step flow progression |
| Edit, Modify | Edit trigger |
| Upload, Import, Export | Data transfer |

Mark primary submit buttons in routes.json as `"isPrimary": true`. These become the "main action" of a screen.
