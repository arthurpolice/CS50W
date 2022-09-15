import markdown2
from django.shortcuts import render
from django.http import HttpResponseRedirect


from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    entry_markdown = util.get_entry(title)
    
    if entry_markdown != None:
       return render(request, "encyclopedia/entry_page.html",  {
           "title": title,
           "text": markdown2.markdown(entry_markdown)
        })
    else:
        return render(request, "encyclopedia/entry_page.html", {
            "text": "No entries found"
        })

def search(request):
    query = request.GET.get('q')
    try:
        return entry(request, query)
    except:
        return render(request, "encyclopedia/search_results.html", {
            "entries": util.list_entries(),
            "query": query
        })
