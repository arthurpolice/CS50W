import markdown2
import random
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponseRedirect



from . import util


def index(request):
    entries = util.list_entries()
    entries.sort()
    return render(request, "encyclopedia/index.html", {
        "entries": entries
    })

def entry(request, title):
    entry_markdown = util.get_entry(title)
    
    # If entry has markdown text, render its page.
    if entry_markdown != None:
       return render(request, "encyclopedia/entry_page.html",  {
           "title": title,
           "text": markdown2.markdown(entry_markdown),
           "markdown": entry_markdown
        })
    # If user is looking for a non-existing page through search, give him suggestions of pages that contain his search query somehow. 
    else:
        suggestions = []
        for entry in util.list_entries():
            casefold_entry = entry.casefold()
            if casefold_entry.count(title.casefold()) > 0:
                suggestions += [entry]
        suggestions.sort()
        return render(request, "encyclopedia/search_results.html", {
            "entries": suggestions,
            "query": title
        })

# Get query and send it to entry().
def search(request):
    query = request.GET.get('q')
    return entry(request, query)

def new_page(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        # Save old title for naming the entry.
        old_title = title
        # Casefold the title as new_title for comparing to casefolded items from existing entries.
        new_title = title.casefold()
        existing_titles = util.list_entries()
        new_existing_titles = []
        # Casefold existing entries' titles.
        for item in existing_titles:
            new_existing_titles += [item.casefold()]
        # If the title of the current entry isn't found, let the user save this new entry.
        if new_title not in new_existing_titles:
            title = old_title.capitalize()
            util.save_entry(old_title, content)
        # If it's found, render an error message.
        else:
            return render (request, "encyclopedia/new_page.html", {
                "error": "Entry already exists.",
                "link": util.get_entry(old_title),
                "page": "encyclopedia:new_page",
                "button": "Submit Entry"
            })
        # Redirect user to the entry page upon success.
        return HttpResponseRedirect(reverse("encyclopedia:entry", args=[old_title]))
    # Renders the page through GET, to render the input fields.
    else:
        return render(request, "encyclopedia/new_page.html", {
            "button": "Submit Entry",
            "page": "encyclopedia:new_page"
        })

def edit_page(request):
    # Send these two pieces of information to the edit_page.html, which is a slight variation of new_page.html. 
    # It will then be sent to the edit route after the changes.
    title = request.POST.get("title")
    content = request.POST.get("content")
    return render(request, "encyclopedia/edit_page.html", {
        "title": title,
        "content": content,
        "button": "Edit Entry",
        "page": "encyclopedia:edit"
    })

# The edit route, unlike the new_page route, doesn't stop users from submiting "entries that already exist".
# To prevent unwanted behaviour with the entry's title, the title input field was set to read only in edit_page.html.
def edit(request):
    title = request.POST.get("title")
    content = request.POST.get("content")
    util.save_entry(title, content)
    # Redirect user to entry's page upon success.
    return HttpResponseRedirect(reverse("encyclopedia:entry", args=[title]))

def randomize(request):
    # Choose a random title from the list of entries. 
    title = random.choice(util.list_entries())
    # Redirect user to entry's page upon success.
    return HttpResponseRedirect(reverse("encyclopedia:entry", args=[title]))
