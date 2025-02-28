/**
 * Generates a Java class, interface, or other Java structure dynamically.
 * 
 * @param {Object} options - The options for generating the Java class.
 * @param {string} options.name - The name of the class or interface.
 * @param {string} options.packageName - The package name for the Java file.
 * @param {string} [options.type='class'] - The type of Java structure (class, interface, etc.).
 * @param {string} [options.extendClass=''] - The class to extend (if applicable).
 * @param {string[]} [options.implementInterfaces=[]] - List of interfaces to implement.
 * @param {string[]} [options.imports=[]] - List of import statements.
 * @param {Object[]} [options.fields=[]] - Fields to include in the class.
 * @param {Object[]} [options.methods=[]] - Methods to include in the class.
 * @param {string[]} [options.annotations=[]] - Annotations to add to the class.
 * @returns {string} The generated Java class as a string.
 * 
 * @example
 * const javaClass = generateJavaTemplate({
 *   name: 'MyClass',
 *   packageName: 'com.example',
 *   type: 'class',
 *   extendClass: 'BaseClass',
 *   implementInterfaces: ['Serializable'],
 *   imports: ['java.io.Serializable'],
 *   fields: [{ accessModifier: 'private', type: 'String', name: 'data' }],
 *   methods: [{ 
 *     name: 'getData', 
 *     accessModifier: 'public', 
 *     returnType: 'String', 
 *     bodyLines: ['return this.data;'] 
 *   }]
 * });
 * console.log(javaClass);
 */
export function generateJavaTemplate({
  name,
  packageName,
  type = "class",
  extendClass = "",
  implementInterfaces = [],
  imports = [],
  fields = [],
  methods = [],
  annotations = []
}) {
  const packageSection = packageName ? `package ${packageName};\n` : '';
  const importsSection = imports.map(i => `import ${i};`).join('\n');
  
  const classAnnotations = annotations.map(a => `@${a}`).join('\n');
  const extendsSection = extendClass ? ` extends ${extendClass}` : '';
  const implementsSection = implementInterfaces.length > 0 ? ` implements ${implementInterfaces.join(', ')}` : '';
  
  const fieldsSection = fields.map(f => {
      const modifiers = f.accessModifier ? `${f.accessModifier} ` : '';
      const staticFinal = f.isStaticFinal ? 'static final ' : '';
      return `    ${modifiers}${staticFinal}${f.type} ${f.name}${f.initialValue ? ` = ${f.initialValue}` : ''};`;
  }).join('\n');
  
  const methodsSection = methods.map(method => {
      const methodAnnotations = (method.annotations || []).map(a => `    @${a}`).join('\n');
      const accessModifier = method.accessModifier ? `${method.accessModifier} ` : '';
      const parameters = (method.parameters || []).join(', ');
      const exceptions = (method.exceptions || []).length > 0 ? ` throws ${method.exceptions.join(', ')}` : '';
      const signature = `    ${accessModifier}${method.returnType || 'void'} ${method.name}(${parameters})${exceptions}`;
      const bodyLines = (method.bodyLines || []).map(line => `        ${line}`).join('\n');
      const body = bodyLines ? `    {\n${bodyLines}\n    }` : '    {\n    }';
      
      return [methodAnnotations, signature + body]
          .filter(part => part.trim().length > 0)
          .join('\n');
  }).join('\n\n');
  
  const classSections = [];
  if (classAnnotations) classSections.push(classAnnotations);
  
  classSections.push(`public ${type} ${name}${extendsSection}${implementsSection} {`);
  
  if (fields.length > 0) {
      classSections.push(fieldsSection);
  }
  
  if (methods.length > 0) {
      classSections.push(methodsSection);
  }
  
  const classBody = classSections.join('\n');
  
  const sections = [];
  if (packageSection) sections.push(packageSection);
  if (imports.length > 0) sections.push(importsSection);
  sections.push(classBody);
  
  const fullCode = sections.filter(s => s).join('\n\n') + '\n}';
  
  return fullCode;
}