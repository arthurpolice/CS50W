from django import forms
from .util import categories

class ListingForm(forms.Form):
    title = forms.CharField(label='Title of Listing', max_length=100, widget=forms.TextInput(attrs={'class':'form-control title-field'}))
    categories = forms.ChoiceField(choices = categories, widget=forms.Select(attrs={'class':'form-select'}))
    buyout = forms.FloatField(label='Buyout', required=False, widget=forms.TextInput(attrs={'class':'form-control money-field', 'step': 2}))
    start_bid = forms.FloatField(label='Minimum Bid', widget=forms.TextInput(attrs={'class':'form-control money-field', 'step': 2}))
    quantity_field = forms.IntegerField(label="Quantity", widget=forms.TextInput(attrs={'class':'form-control money-field'}))
    image_1 = forms.CharField(label='URL to First Image', max_length=256,  required=False, widget=forms.TextInput(attrs={'class':'form-control image-field'}))
    image_2 = forms.CharField(label='URL to Second Image', max_length=256,  required=False, widget=forms.TextInput(attrs={'class':'form-control image-field'}))
    image_3 = forms.CharField(label='URL to Third Image', max_length=256,  required=False, widget=forms.TextInput(attrs={'class':'form-control image-field'}))
    image_4 = forms.CharField(label='URL to Fourth Image', max_length=256,  required=False, widget=forms.TextInput(attrs={'class':'form-control image-field'}))
    image_5 = forms.CharField(label='URL to Fifth Image', max_length=256,  required=False, widget=forms.TextInput(attrs={'class':'form-control image-field'}))
    description = forms.CharField(label="Description", max_length=512, widget=forms.TextInput(attrs={'class':'form-control description'}))

class PurchaseForm(forms.Form):
    bid_field = forms.FloatField(label="Bid", widget=forms.TextInput(attrs={'class':'form-control money-field', 'step': 2}))