// Simple Template Engine for rendering JSON data dynamically
class SimpleTemplateEngine {
  constructor(template_url) {
    this.template_url = template_url;
  }

  loadtemplate() {
    return fetch(this.template_url)
      .then(response => response.text())
      .then(text => {
        this.template = text;
      });
  }

  rendortemplate(divtag, data) {
    const tag = document.getElementById(divtag);
    let output = this.template;

    // Handle {{#each}} loops for iterating over JSON arrays
    output = output.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, TemplateFragment) => {
      const ListOfThings = data[arrayName];
      if (!Array.isArray(ListOfThings)) {
        return '';
      }
      return ListOfThings.map(item => this.replaceVariableInFragment(TemplateFragment, item)).join('');
    });

    // Replace variables dynamically
    output = output.replace(/{{(\w+)}}/g, (match, variable) => {
      return data[variable] || '';
    });

    tag.innerHTML = output;
  }

  replaceVariableInFragment(TemplateFragment, data) {
    return TemplateFragment.replace(/{{(\w+)}}/g, (match, variable) => {
      return data[variable] || '';
    });
  }
}

// Fetch timeline data from the server
fetch('/timeline')
  .then(response => response.json())
  .then(data => {
    // Render timeline
    const tEngine_timeline = new SimpleTemplateEngine('timeline-template.html');
    tEngine_timeline.loadtemplate().then(() => {
      tEngine_timeline.rendortemplate('timeline', data);
    });

    // Display key milestones
    let milestonesHTML = '<h3>Notable Internet Milestones in India:</h3><ul>';
    data.timeline.forEach(milestone => {
      milestonesHTML += `<li><strong>${milestone.year}:</strong> ${milestone.description}</li>`;
    });
    milestonesHTML += '</ul>';
    document.getElementById("highlight-content").innerHTML = milestonesHTML;
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
