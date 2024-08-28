# <%= packageName %>

<%= description %>

### Install
```bash
# If you don't have yeoman installed
npm install -g yo

# Install the generator
npm install -g <%= packageName %>
```

### Using the generator
```bash
# Will create a new app in ./test-app directory
<% if (scope) { %>
yo <%= scope %>/<%= generatorName %> test-generator
<% } else { %>
yo <%= generatorName %> test-generator
<% } %>

# Consult the README.md in the ./test-app directory for more information
```
