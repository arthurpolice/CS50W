import markdown2
from django.shortcuts import render
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
    
    if entry_markdown != None:
       return render(request, "encyclopedia/entry_page.html",  {
           "title": title,
           "text": markdown2.markdown(entry_markdown),
           "markdown": entry_markdown
        })
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

def search(request):
    query = request.GET.get('q')
    return entry(request, query)

def new_page(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        new_title = title.casefold()
        existing_titles = util.list_entries()
        new_existing_titles = []
        
        for item in existing_titles:
            new_existing_titles += [item.casefold()]
        if new_title not in new_existing_titles:
            title = title.capitalize()
            util.save_entry(title, content)
        else:
            return render (request, "encyclopedia/new_page.html", {
                "error": "Entry already exists.",
                "link": util.get_entry(title)
            })

        entry_markdown = util.get_entry(title)
        if entry_markdown != None:
           return render(request, "encyclopedia/entry_page.html",  {
               "title": title,
               "text": markdown2.markdown(entry_markdown)
            })
    else:
        return render(request, "encyclopedia/new_page.html")

def edit_page(request):
    return 0