import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { FormValidator } from 'src/app/validators/form-validator';


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

  getStates(formGroupname: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupname);
    const countryCode = formGroup.value.country.code;
    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupname === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        if (formGroupname === 'billingAddress') {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }


  buildCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
        lastName:  new FormControl('',[Validators.required,Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required, Validators.email])
      }),
        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhiteSpace])
      }),
        billingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2),FormValidator.notOnlyWhiteSpace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2),FormValidator.notOnlyWhiteSpace])
      }),
        creditCard: this.formBuilder.group({
          cardType: new FormControl('', [Validators.required]),
          nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhiteSpace]),
          cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
          securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
          expirationMonth: [''],
          expirationYear: ['']
      })
    });
  }


  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

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
