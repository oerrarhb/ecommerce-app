import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  checkoutFormGroup: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService) {

  }

  ngOnInit(): void {
    this.buildCheckoutForm();
    this.fillCreditCardYearsAndMonths();
    this.fillCountries();
  }


  private fillCreditCardYearsAndMonths() {
    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );
  }

  fillCountries() {
    this.shopFormService.getCountries().subscribe(
      data => this.countries = data
    );
  }

  getStates(formGroupname : string) {
    const formGroup = this.checkoutFormGroup.get(formGroupname);
    const countryCode = formGroup.value.country.code;
    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupname === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        if(formGroupname === 'billingAddress') {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );

  }


  buildCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  handleMonthsAndYears() {
    let creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  copyShippingAddressToBillingAddress(event: any) {
    const billingAddressControl = this.checkoutFormGroup.get('billingAddress');
    const shippingAddressControl = this.checkoutFormGroup.get('shippingAddress');

    if (billingAddressControl && shippingAddressControl && event.target.checked) {
      billingAddressControl.setValue(shippingAddressControl.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      billingAddressControl.reset();
      this.billingAddressStates = [];
    }
  }
}
