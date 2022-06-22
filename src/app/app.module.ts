import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomfilterPipe } from './pipe/customfilter.pipe';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';

@NgModule({
  declarations: [AppComponent, CustomfilterPipe, DynamicTableComponent],
  imports: [BrowserModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
