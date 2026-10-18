import {Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  @Input() currentDate: Date;
  @Output() blur: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('daysContainer') days!: ElementRef<HTMLElement>;
  @ViewChild('yearSelectDiv') years!: ElementRef<HTMLElement>;
  @ViewChild('monthSelectDiv') months!: ElementRef<HTMLElement>;

  activeDay: number;
  activeMonth: number;
  activeYear: number;

  displayDate: Date;

  monthScroll: boolean = false;
  yearScroll: boolean = false;
  yearsToScroll: number[] = [];
  monthIndexes: number[] = Array.from({ length: 12 }, (_, index) => index);

  constructor(protected renderer: Renderer2) {}

  ngOnInit(): void {
    this.activeYear = this.currentDate.getFullYear();
    this.activeMonth = this.currentDate.getMonth();
    this.activeDay = this.currentDate.getFullYear();

    this.yearsToScroll = Array.from(
      { length: (new Date().getFullYear()) - 1900 + 11 },
      (_, index) => 1900 + index
    );

    this.updateDisplayDate();
  }

  ngAfterViewInit() {
    this.pushDayCards();
  }

  pushDayCards(){
    const firstDayOfMonth = new Date(this.activeYear, this.activeMonth, 1);
    const numberOfDays = new Date(this.activeYear, this.activeMonth + 1, 0).getDate();
    const lastDayOfPreviousMonth = new Date(this.activeYear, this.activeMonth, 0).getDate();
    const previousMonthDayCount = (firstDayOfMonth.getDay() + 6) % 7;
    const today = new Date();

    //Push last days of prev month
    for (let offset = previousMonthDayCount - 1; offset >= 0; offset--) {
      const day = lastDayOfPreviousMonth - offset;
      const dayCard = this.renderer.createElement('a');

      this.renderer.addClass(dayCard, 'inactive_date');
      this.renderer.setProperty(dayCard, 'textContent', day.toString());

      this.renderer.appendChild(
        this.days.nativeElement,
        dayCard
      );
    }

    //Push active dates of month
    for (let day = 1; day <= numberOfDays; day++) {
      const dayCard = this.renderer.createElement('a');
      this.renderer.setProperty(dayCard, 'textContent', day.toString());

      const isToday =
        today.getFullYear() === this.activeYear &&
        today.getMonth() === this.activeMonth &&
        today.getDate() === day;

      this.renderer.addClass(dayCard, isToday ? 'current_date' : 'active_date');
      this.renderer.listen(dayCard, 'click', () => {
        const selectedDate = new Date(this.activeYear, this.activeMonth, day);
        this.blur.emit(selectedDate);
      });
      this.renderer.appendChild(this.days.nativeElement, dayCard);
    }

    const occupiedCells = previousMonthDayCount + numberOfDays;

    const nextMonthDayCount = (7 - occupiedCells % 7) % 7;


    //Push active dates of month
    for (let day = 1; day <= nextMonthDayCount; day++) {
      const dayCard = this.renderer.createElement('a');

      this.renderer.addClass(dayCard, 'inactive_date');
      this.renderer.setProperty(dayCard, 'textContent', day.toString());
      this.renderer.appendChild(this.days.nativeElement, dayCard);
    }
  }

  protected toggleYearScroll(event: MouseEvent): void {
    event.stopPropagation();

    this.yearScroll = !this.yearScroll;
    this.monthScroll = false;
  }

  protected toggleMonthScroll(event: MouseEvent): void {
    event.stopPropagation();

    this.monthScroll = !this.monthScroll;
    this.yearScroll = false;
  }

  protected selectYear(year: number, event: MouseEvent): void {
    event.stopPropagation();

    this.activeYear = year;
    this.yearScroll = false;
    this.currentDate.setFullYear(year);

    this.clearDayCards();
    this.updateDisplayDate();
    this.pushDayCards();
  }

  protected selectMonth(month: number, event: MouseEvent): void {
    event.stopPropagation();

    this.activeMonth = month;
    this.monthScroll = false;
    this.currentDate.setMonth(month);

    this.clearDayCards();
    this.updateDisplayDate();
    this.pushDayCards();
  }

  private clearDayCards(): void {
    const container = this.days.nativeElement;

    while (container.firstChild) {
      this.renderer.removeChild(container, container.firstChild);
    }
  }

  private updateDisplayDate(): void {
    this.displayDate = new Date(
      this.activeYear,
      this.activeMonth,
      1
    );
  }

  protected readonly Array = Array;

  @HostListener('document:click', ['$event'])
  exitSelection(event: MouseEvent): void {
    if (!this.monthScroll || !this.yearScroll) return;

    const target = event.target as Node;

    if (!this.years.nativeElement.contains(target)) {
      this.yearScroll = false;
    }

    if (!this.months.nativeElement.contains(target)) {
      this.monthScroll = false;
    }
  }
}
